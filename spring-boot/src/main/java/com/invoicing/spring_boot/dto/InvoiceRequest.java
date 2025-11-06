package com.invoicing.spring_boot.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
public class InvoiceRequest {

    private double totalAmount;

    private AddressResponse address;

    @JsonIgnoreProperties("invoices")
    private CustomerResponse customer;

    private List<InvoiceItemRequest> invoiceItems;

}
