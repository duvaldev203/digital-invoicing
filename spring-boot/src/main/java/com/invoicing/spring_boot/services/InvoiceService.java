package com.invoicing.spring_boot.services;

import com.invoicing.spring_boot.dto.InvoiceRequest;
import com.invoicing.spring_boot.dto.InvoiceResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface InvoiceService {

    public ResponseEntity<Page<InvoiceResponse>> index();

    public ResponseEntity<InvoiceResponse> show(String invoiceNumber);

    public ResponseEntity<InvoiceResponse> create(InvoiceRequest invoice);

    public ResponseEntity<InvoiceResponse> update(InvoiceRequest invoice, String invoiceNumber);

    public ResponseEntity<?> delete(String invoiceNumber);
}
