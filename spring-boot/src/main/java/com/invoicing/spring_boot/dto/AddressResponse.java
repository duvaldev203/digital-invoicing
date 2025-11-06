package com.invoicing.spring_boot.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class AddressResponse {
    private Long id;
    private String street;
    private String state;
    private String city;
    private String zipCode;
    private String country;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
