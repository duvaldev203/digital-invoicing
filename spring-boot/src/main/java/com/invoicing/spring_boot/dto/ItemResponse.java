package com.invoicing.spring_boot.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ItemResponse {

    private Long id;

    private String name;

    private double price;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
