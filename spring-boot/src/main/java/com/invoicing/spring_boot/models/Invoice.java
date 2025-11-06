package com.invoicing.spring_boot.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Table
@Entity(name = "invoices")
@Data
public class Invoice {

    @Id
    @Column(name = "invoice_number")
    private String invoiceNumber;

    @PrePersist
    public void generateInvoiceNumber() {
        if (this.invoiceNumber == null) {
            this.invoiceNumber = "INV-" + java.time.Year.now() + "-" + System.currentTimeMillis() % 1000000;
        }

        // Calculate invoice's total amount
        /*double total = 0.0;
        if (this.invoiceItems != null) {
            for (InvoiceItem item : this.invoiceItems) {
                if (item != null) {
                    total += item.getTotalPrice();
                }
            }
        }
        this.totalAmount = total;*/
    }

//    @NotNull(message = "Montant total : Ce champ est obligatoire")
    private double totalAmount;

    @OneToOne(cascade = {CascadeType.REMOVE})
    @JoinColumn(name = "billing_address")
    @ToString.Exclude
    private Address address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @ToString.Exclude
    private Customer customer;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<InvoiceItem> invoiceItems;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false, updatable = true)
    private Timestamp updatedAt;
}
