package com.invoicing.spring_boot.repositories;

import com.invoicing.spring_boot.models.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {
    List<Address> findByStreetContainingOrCityContainingOrStateContainingOrCountryContaining(String search, String search1, String search2, String search3);
}
