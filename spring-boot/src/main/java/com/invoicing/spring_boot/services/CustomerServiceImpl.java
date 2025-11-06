package com.invoicing.spring_boot.services;

import com.invoicing.spring_boot.config.AppConstants;
import com.invoicing.spring_boot.dto.CustomerRequest;
import com.invoicing.spring_boot.dto.CustomerResponse;
import com.invoicing.spring_boot.exceptions.NotFoundException;
import com.invoicing.spring_boot.models.Customer;
import com.invoicing.spring_boot.repositories.CustomerRepo;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepo customerRepo;

    private final ModelMapper mapper;

    @Autowired
    public CustomerServiceImpl(CustomerRepo customerRepo, ModelMapper mapper) {
        this.customerRepo = customerRepo;
        this.mapper = mapper;
    }

    @Override
    public ResponseEntity<Page<CustomerResponse>> index() {
        return new ResponseEntity<>(customerRepo.findAll(AppConstants.PAGEABLE)
                .map(el -> mapper.map(el, CustomerResponse.class)), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<CustomerResponse> show(Long id) {
        Customer resp = customerRepo.findById(id).
                orElseThrow(() -> new NotFoundException("Le Client", id));
        return new ResponseEntity<>(mapper.map(resp,
                CustomerResponse.class), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<CustomerResponse> create(CustomerRequest customer) {
        Customer resp = customerRepo.save(mapper.map(customer, Customer.class));
        return new ResponseEntity<>(mapper.map(resp, CustomerResponse.class), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<CustomerResponse> update(CustomerRequest customer, Long id) {
        customerRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Le Client ", id));
        Customer old = mapper.map(customer, Customer.class);
        old.setId(id);
        Customer resp = customerRepo.save(old);
        return new ResponseEntity<>(mapper.map(resp, CustomerResponse.class), HttpStatus.ACCEPTED);
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Customer customer = customerRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Le Client", id));
        customerRepo.delete(customer);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<CustomerResponse>> records(String search) {
        List<Customer> customer = customerRepo.findByNameContainingOrEmailContaining(search, search);
        List<CustomerResponse> resp = customer.stream().map(
                el -> mapper.map(el, CustomerResponse.class)).toList();
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }
}
