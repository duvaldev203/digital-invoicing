package com.invoicing.spring_boot.repositories;

import com.invoicing.spring_boot.models.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepo extends JpaRepository<Invoice, String> {
//    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
}
