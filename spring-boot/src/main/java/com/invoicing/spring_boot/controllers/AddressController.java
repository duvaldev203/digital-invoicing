package com.invoicing.spring_boot.controllers;

import com.invoicing.spring_boot.dto.AddressRequest;
import com.invoicing.spring_boot.dto.AddressResponse;
import com.invoicing.spring_boot.services.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    private final AddressService service;

    @Autowired
    public AddressController(AddressService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<Page<AddressResponse>> index() {
        return service.index();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> show(@PathVariable Long id) {
        return service.show(id);
    }

    @PostMapping("/")
    public ResponseEntity<AddressResponse> create(@RequestBody AddressRequest address) {
        return service.create(address);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> update(@PathVariable Long id, @RequestBody AddressRequest address) {
        return service.update(address, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return service.delete(id);
    }

    @GetMapping("/records/{search}")
    public ResponseEntity<List<AddressResponse>> records(@PathVariable String search){
        return service.records(search);
    }
}
