package com.invoicing.spring_boot.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceItemKey {

    @Column(name = "invoice_number")
    private String invoiceId;

    @Column(name = "item_id")
    private Long itemId;

}
