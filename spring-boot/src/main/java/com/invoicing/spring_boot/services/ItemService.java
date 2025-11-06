package com.invoicing.spring_boot.services;

import com.invoicing.spring_boot.dto.ItemRequest;
import com.invoicing.spring_boot.dto.ItemResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ItemService {

    public ResponseEntity<Page<ItemResponse>> index();

    public ResponseEntity<ItemResponse> show(Long id);

    public ResponseEntity<ItemResponse> create(ItemRequest Item);

    public ResponseEntity<ItemResponse> update(ItemRequest Item, Long id);

    public ResponseEntity<?> delete(Long id);

    ResponseEntity<List<ItemResponse>> records(String search);
}
