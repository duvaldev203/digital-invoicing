package com.invoicing.spring_boot.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "items")
@Data
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @NotNull(message = "Nom du produit : Ce champ est obligatoire")
    private String name;

//    @NotNull(message = "Prix : Ce champ est obligatoire")
    private double price;

    @OneToMany(mappedBy = "item", cascade = {CascadeType.MERGE})
    private List<InvoiceItem> invoiceItems;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false, updatable = true)
    private Timestamp updatedAt;
}
