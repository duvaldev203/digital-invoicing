package com.invoicing.spring_boot.repositories;

import com.invoicing.spring_boot.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, Long> {
    List<Customer> findByNameContainingOrEmailContaining(String search, String search1);
}
