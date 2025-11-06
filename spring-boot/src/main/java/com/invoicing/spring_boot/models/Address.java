package com.invoicing.spring_boot.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "addresses")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @NotNull(message = "street : Ce champ est obligatoire")
    private String street;

    private String state;

//    @NotNull(message = "Ville : Ce champ est obligatoire")
    private String city;

    private String zipCode;

//    @NotNull(message = "Pays : Ce champ est obligatoire")
    private String country;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false, updatable = true)
    private Timestamp updatedAt;
}
