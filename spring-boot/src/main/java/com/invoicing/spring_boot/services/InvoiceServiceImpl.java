package com.invoicing.spring_boot.services;

import com.invoicing.spring_boot.config.AppConstants;
import com.invoicing.spring_boot.dto.InvoiceItemRequest;
import com.invoicing.spring_boot.dto.InvoiceRequest;
import com.invoicing.spring_boot.dto.InvoiceResponse;
import com.invoicing.spring_boot.dto.CustomResponse;
import com.invoicing.spring_boot.exceptions.NotFoundException;
import com.invoicing.spring_boot.models.Invoice;
import com.invoicing.spring_boot.models.InvoiceItem;
import com.invoicing.spring_boot.models.InvoiceItemKey;
import com.invoicing.spring_boot.models.Item;
import com.invoicing.spring_boot.repositories.AddressRepo;
import com.invoicing.spring_boot.repositories.CustomerRepo;
import com.invoicing.spring_boot.repositories.InvoiceRepo;
import com.invoicing.spring_boot.repositories.ItemRepo;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepo invoiceRepo;

    private final ModelMapper mapper;

    /*
     *** Utils
     */
    private final CustomerRepo customerRepo;
    private final AddressRepo addressRepo;
    private final ItemRepo itemRepo;

    @Autowired
    public InvoiceServiceImpl(InvoiceRepo invoiceRepo, ModelMapper mapper, CustomerRepo customerRepo,
                              AddressRepo addressRepo, ItemRepo itemRepo) {
        this.invoiceRepo = invoiceRepo;
        this.mapper = mapper;
        this.customerRepo = customerRepo;
        this.addressRepo = addressRepo;
        this.itemRepo = itemRepo;
    }

    @Override
    public ResponseEntity<Page<InvoiceResponse>> index() {
        return new ResponseEntity<>(invoiceRepo.findAll(AppConstants.PAGEABLE)
                .map(el -> mapper.map(el, InvoiceResponse.class)), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<InvoiceResponse> show(String invoiceNumber) {
        Invoice inv = invoiceRepo.findById(invoiceNumber).
                orElseThrow(() -> new NotFoundException("La Facture de numero " + invoiceNumber));
        return new ResponseEntity<>(mapper.map(inv, InvoiceResponse.class), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<InvoiceResponse> create(InvoiceRequest invoice) {
        customerRepo.findById(invoice.getCustomer().getId())
                .orElseThrow(() -> new NotFoundException("Le client de la facture"));

        addressRepo.findById(invoice.getAddress().getId())
                .orElseThrow(() -> new NotFoundException("L'addresse de la facture"));

        Invoice req = mapper.map(invoice, Invoice.class);
//        System.out.println("Invoice : " + req);
        req.setInvoiceItems(new ArrayList<>());

        req = invoiceRepo.saveAndFlush(req);
        double totalAmount = 0.0;

        if (invoice.getInvoiceItems() != null && !invoice.getInvoiceItems().isEmpty()) {
            for (InvoiceItemRequest itemRequest : invoice.getInvoiceItems()) {
                Item product = itemRepo.findById(itemRequest.getItem().getId())
                        .orElseThrow(() -> new NotFoundException("Le Produit", itemRequest.getItem().getId()));

                double itemTotalPrice = product.getPrice() * itemRequest.getQuantity();
                InvoiceItemKey itemKey = new InvoiceItemKey();
                itemKey.setInvoiceId(req.getInvoiceNumber()); // Utiliser le numéro généré
                itemKey.setItemId(product.getId());

                InvoiceItem invoiceItem = new InvoiceItem();
                invoiceItem.setId(itemKey); // IMPORTANT: Définir la clé composite
                invoiceItem.setInvoice(req);
                invoiceItem.setItem(product);
                invoiceItem.setQuantity(itemRequest.getQuantity());
                invoiceItem.setTotalPrice(itemTotalPrice);

                req.getInvoiceItems().add(invoiceItem);
                totalAmount += itemTotalPrice;
            }
        }

        req.setTotalAmount(totalAmount);

        Invoice savedInvoice = invoiceRepo.save(req);
        InvoiceResponse response = mapper.map(savedInvoice, InvoiceResponse.class);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<InvoiceResponse> update(InvoiceRequest invoice, String invoiceNumber) {
        Invoice req = invoiceRepo.findById(invoiceNumber)
                .orElseThrow(() -> new NotFoundException("La Facture de numero " + invoiceNumber));
        req.setCustomer(customerRepo.findById(invoice.getCustomer().getId())
                .orElseThrow(() -> new NotFoundException("Le Client")));
        req.setAddress(addressRepo.findById(invoice.getAddress().getId())
                .orElseThrow(() -> new NotFoundException("L'Adresse")));

//        System.out.println(req);
        if (req.getInvoiceItems() == null)
            req.setInvoiceItems(new ArrayList<>());
        else req.getInvoiceItems().clear();

        double total = 0.0;

        for (InvoiceItemRequest itemReq : invoice.getInvoiceItems()) {
            Item item = itemRepo.findById(itemReq.getItem().getId())
                    .orElseThrow(() -> new NotFoundException("Produit", itemReq.getItem().getId()));

            double totalPrice = item.getPrice() * itemReq.getQuantity();

            InvoiceItem invoiceItem = new InvoiceItem();
            invoiceItem.setId(new InvoiceItemKey(invoiceNumber, item.getId()));
            invoiceItem.setInvoice(req);
            invoiceItem.setItem(item);
            invoiceItem.setQuantity(itemReq.getQuantity());
            invoiceItem.setTotalPrice(totalPrice);

            req.getInvoiceItems().add(invoiceItem);
            total += totalPrice;
        }

        req.setTotalAmount(total);

        return new ResponseEntity<>(mapper.map(invoiceRepo.save(req), InvoiceResponse.class), HttpStatus.ACCEPTED);
    }


    @Override
    public ResponseEntity<?> delete(String id) {
        Invoice req = invoiceRepo.findById(id).
                orElseThrow(() -> new NotFoundException("La Facture de numero " + id));
        invoiceRepo.delete(req);
        CustomResponse resp = new CustomResponse(
                "Facture supprimée.",
                new java.sql.Timestamp(System.currentTimeMillis())
        );
        return new ResponseEntity(resp, HttpStatus.OK);
    }
}
