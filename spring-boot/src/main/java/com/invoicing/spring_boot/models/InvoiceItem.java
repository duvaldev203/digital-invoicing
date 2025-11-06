package com.invoicing.spring_boot.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "invoice_items")
@Data
public class InvoiceItem {

    @EmbeddedId
    private InvoiceItemKey id;

    @ManyToOne
    @MapsId("invoiceId")
    @JoinColumn(name = "invoice_number")
    @ToString.Exclude
    private Invoice invoice;

    @ManyToOne
    @MapsId("itemId")
    @JoinColumn(name = "item_id")
    @ToString.Exclude
    private Item item;

//    @NotNull(message = "Quantite : Ce champ est obligatoire")
    private int quantity;

    @Column(name = "total_price")
    private Double totalPrice;

    @PrePersist
    @PreUpdate
    public void calculateTotalPrice() {
        this.totalPrice = this.quantity * this.item.getPrice();
//        System.out.println(this);
    }
}

