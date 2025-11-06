package com.invoicing.spring_boot.repositories;

import com.invoicing.spring_boot.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepo extends JpaRepository<Item, Long> {
    List<Item> findByNameContaining(String search);
}
