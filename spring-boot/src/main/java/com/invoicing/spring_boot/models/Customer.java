package com.invoicing.spring_boot.models;

import jakarta.persistence.*;
import lombok.Data;

import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "customers")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
//    @NotNull(message = "nom : Ce champ est obligatoire")
    private String name;

    @Column(name = "email", unique = true)
//    @NotNull(message = "email : Ce champ est obligatoire")
//    @Email(message = "email invalide")
    private String email;

    @Column(name = "phone")
//    @NotNull(message = "tel : Ce champ est obligatoire")
//    @Pattern(regexp = "^(\\+237|237)?[2368]\\d{8}$", message = "Numéro de téléphone invalide")
    private String phone;

    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Invoice> invoices;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false, updatable = true)
    private Timestamp updatedAt;
}
