package com.invoicing.spring_boot.controllers;

import com.invoicing.spring_boot.dto.ItemRequest;
import com.invoicing.spring_boot.dto.ItemResponse;
import com.invoicing.spring_boot.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
public class ItemController {

    private final ItemService service;

    @Autowired
    public ItemController(ItemService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<Page<ItemResponse>> index() {
        return service.index();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> show(@PathVariable Long id) {
        return service.show(id);
    }

    @PostMapping("/")
    public ResponseEntity<ItemResponse> create(@RequestBody ItemRequest item) {
        return service.create(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse> update(@PathVariable Long id, @RequestBody ItemRequest item) {
        return service.update(item, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return service.delete(id);
    }

    @GetMapping("/records/{search}")
    public ResponseEntity<List<ItemResponse>> records(@PathVariable String search){
        return service.records(search);
    }
}
