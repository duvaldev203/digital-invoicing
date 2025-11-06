package com.invoicing.spring_boot.dto;

import lombok.Data;

@Data
public class AddressRequest {
    private String street;
    private String state;
    private String city;
    private String zipCode;
    private String country;

}
