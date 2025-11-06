package com.invoicing.spring_boot.dto;

import lombok.Data;

@Data
public class InvoiceItemRequest {

    private ItemResponse item;

    private Integer quantity;

    private double totalPrice;
}
