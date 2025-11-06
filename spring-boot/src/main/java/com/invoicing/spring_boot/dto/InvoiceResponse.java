package com.invoicing.spring_boot.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class InvoiceResponse {
//    private Long id;

    private String invoiceNumber;

    private double totalAmount;

    private AddressResponse address;

    @JsonIgnoreProperties({"invoices"})
    private CustomerResponse customer;

    private List<InvoiceItemResponse> invoiceItems;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
