package com.invoicing.spring_boot.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ItemRequest {

    private String name;

    private double price;
}
