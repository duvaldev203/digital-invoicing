package com.invoicing.spring_boot.dto;

import lombok.Data;

@Data
public class CustomerRequest {
    private String name;
    private String email;
    private String phone;
    private AddressResponse address;
}
