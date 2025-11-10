package com.invoicing.spring_boot.services;

import com.invoicing.spring_boot.config.AppConstants;
import com.invoicing.spring_boot.dto.ItemRequest;
import com.invoicing.spring_boot.dto.ItemResponse;
import com.invoicing.spring_boot.dto.CustomResponse;
import com.invoicing.spring_boot.exceptions.NotFoundException;
import com.invoicing.spring_boot.models.Item;
import com.invoicing.spring_boot.repositories.ItemRepo;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemServiceImpl implements ItemService {

    private final ItemRepo itemRepo;

    private final ModelMapper mapper;

    @Autowired
    public ItemServiceImpl(ItemRepo itemRepo, ModelMapper mapper) {
        this.itemRepo = itemRepo;
        this.mapper = mapper;
    }

    @Override
    public ResponseEntity<Page<ItemResponse>> index() {
        return new ResponseEntity<>(itemRepo.findAll(AppConstants.PAGEABLE)
                .map(el -> mapper.map(el, ItemResponse.class)), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ItemResponse> show(Long id) {
        Item resp = itemRepo.findById(id).
                orElseThrow(() -> new NotFoundException("Le Produit", id));
        return new ResponseEntity<>(mapper.map(resp,
                ItemResponse.class), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ItemResponse> create(ItemRequest item) {
        Item resp = itemRepo.save(mapper.map(item, Item.class));
        return new ResponseEntity<>(mapper.map(resp, ItemResponse.class), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ItemResponse> update(ItemRequest item, Long id) {
        itemRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Le Produit ", id));
        Item old = mapper.map(item, Item.class);
        old.setId(id);
        Item resp = itemRepo.save(old);
        return new ResponseEntity<>(mapper.map(resp, ItemResponse.class), HttpStatus.ACCEPTED);
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Item item = itemRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Le Produit", id));
        itemRepo.delete(item);
        CustomResponse resp = new CustomResponse(
                "Produit supprimée.",
                new java.sql.Timestamp(System.currentTimeMillis())
        );
        return new ResponseEntity(resp, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<ItemResponse>> records(String search) {
        List<Item> item = itemRepo.findByNameContaining(search);
        List<ItemResponse> resp = item.stream().map(
                el -> mapper.map(el, ItemResponse.class)).toList();
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }
}
