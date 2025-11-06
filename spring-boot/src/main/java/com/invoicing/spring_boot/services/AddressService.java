package com.invoicing.spring_boot.services;

import com.invoicing.spring_boot.dto.AddressRequest;
import com.invoicing.spring_boot.dto.AddressResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface AddressService {

    public ResponseEntity<Page<AddressResponse>> index();

    public ResponseEntity<AddressResponse> show(Long id);

    public ResponseEntity<AddressResponse> create(AddressRequest address);

    public ResponseEntity<AddressResponse> update(AddressRequest address, Long id);

    public ResponseEntity<?> delete(Long id);

    ResponseEntity<List<AddressResponse>> records(String search);
}
