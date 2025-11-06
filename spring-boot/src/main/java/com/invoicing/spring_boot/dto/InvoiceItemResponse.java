package com.invoicing.spring_boot.dto;

import com.invoicing.spring_boot.models.InvoiceItemKey;
import lombok.Data;

@Data
public class InvoiceItemResponse {
    private InvoiceItemKey id;

    private ItemResponse item;

    private int quantity;

    private double totalPrice;
}
