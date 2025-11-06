package com.invoicing.spring_boot.controllers;

import com.invoicing.spring_boot.dto.InvoiceRequest;
import com.invoicing.spring_boot.dto.InvoiceResponse;
import com.invoicing.spring_boot.services.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService service;

    @Autowired
    public InvoiceController(InvoiceService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<Page<InvoiceResponse>> index() {
        return service.index();
    }

    @GetMapping("/{invoiceNumber}")
    public ResponseEntity<InvoiceResponse> show(@PathVariable String invoiceNumber) {
        return service.show(invoiceNumber);
    }

    @PostMapping("/")
    public ResponseEntity<InvoiceResponse> create(@RequestBody InvoiceRequest invoice) {
        return service.create(invoice);
    }

    @PutMapping("/{invoiceNumber}")
    public ResponseEntity<InvoiceResponse> update(@PathVariable String invoiceNumber, @RequestBody InvoiceRequest invoice) {
        return service.update(invoice, invoiceNumber);
    }


    @DeleteMapping("/{invoiceNumber}")
    public ResponseEntity<?> delete(@PathVariable String invoiceNumber) {
        return service.delete(invoiceNumber);
    }

}
