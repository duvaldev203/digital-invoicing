package com.invoicing.spring_boot.controllers;

import com.invoicing.spring_boot.dto.CustomerRequest;
import com.invoicing.spring_boot.dto.CustomerResponse;
import com.invoicing.spring_boot.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService service;

    @Autowired
    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<Page<CustomerResponse>> index() {
        return service.index();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> show(@PathVariable Long id) {
        return service.show(id);
    }

    @PostMapping("/")
    public ResponseEntity<CustomerResponse> create(@RequestBody CustomerRequest Customer) {
        return service.create(Customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> update(@PathVariable Long id, @RequestBody CustomerRequest customer) {
        return service.update(customer, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return service.delete(id);
    }

}
