package com.invoicing.spring_boot.services;

import com.invoicing.spring_boot.dto.CustomerRequest;
import com.invoicing.spring_boot.dto.CustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CustomerService {

    public ResponseEntity<Page<CustomerResponse>> index();

    public ResponseEntity<CustomerResponse> show(Long id);

    public ResponseEntity<CustomerResponse> create(CustomerRequest Customer);

    public ResponseEntity<CustomerResponse> update(CustomerRequest Customer, Long id);

    public ResponseEntity<?> delete(Long id);

    ResponseEntity<List<CustomerResponse>> records(String search);
}
