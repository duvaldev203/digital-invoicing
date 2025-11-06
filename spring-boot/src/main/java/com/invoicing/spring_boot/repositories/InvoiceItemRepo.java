package com.invoicing.spring_boot.repositories;

import com.invoicing.spring_boot.models.InvoiceItem;
import com.invoicing.spring_boot.models.InvoiceItemKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceItemRepo extends JpaRepository<InvoiceItem, InvoiceItemKey> {
}
