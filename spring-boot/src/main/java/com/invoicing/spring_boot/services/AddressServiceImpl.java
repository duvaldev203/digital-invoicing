package com.invoicing.spring_boot.services;

import com.invoicing.spring_boot.config.AppConstants;
import com.invoicing.spring_boot.dto.AddressRequest;
import com.invoicing.spring_boot.dto.AddressResponse;
import com.invoicing.spring_boot.exceptions.NotFoundException;
import com.invoicing.spring_boot.models.Address;
import com.invoicing.spring_boot.repositories.AddressRepo;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepo addressRepo;

    private final ModelMapper mapper;

    @Autowired
    public AddressServiceImpl(AddressRepo addressRepo, ModelMapper mapper) {
        this.addressRepo = addressRepo;
        this.mapper = mapper;
    }

    @Override
    public ResponseEntity<Page<AddressResponse>> index() {
        return new ResponseEntity<>(addressRepo.findAll(AppConstants.PAGEABLE)
                .map(el -> mapper.map(el, AddressResponse.class)), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<AddressResponse> show(Long id) {
        Address resp = addressRepo.findById(id).
                orElseThrow(() -> new NotFoundException("L'Adresse", id));
        return new ResponseEntity<>(mapper.map(resp,
                AddressResponse.class), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<AddressResponse> create(AddressRequest address) {
        Address resp = addressRepo.save(mapper.map(address, Address.class));
        return new ResponseEntity<>(mapper.map(resp, AddressResponse.class), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<AddressResponse> update(AddressRequest address, Long id) {
        addressRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Address", id));
        Address old = mapper.map(address, Address.class);
        old.setId(id);
        Address resp = addressRepo.save(old);
        return new ResponseEntity<>(mapper.map(resp, AddressResponse.class), HttpStatus.ACCEPTED);
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Address address = addressRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Addresse", id));
        addressRepo.delete(address);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<AddressResponse>> records(String search) {
        List<Address> address = addressRepo.findByStreetContainingOrCityContainingOrStateContainingOrCountryContaining(search, search, search, search);
        List<AddressResponse> resp = address.stream().map(el->mapper.map(el, AddressResponse.class))
                .toList();
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }
}
