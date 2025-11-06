package com.invoicing.spring_boot.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class CustomerResponse {
    private Long id;

    private String name;

    private String email;

    private String phone;

    private AddressResponse address;

    @JsonIgnoreProperties("customer")
    private List<InvoiceResponse> invoices;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
