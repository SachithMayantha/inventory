package com.fernando.inventory.repository;

import com.fernando.inventory.dto.SupplierNameDto;
import com.fernando.inventory.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

    @Query("SELECT new com.fernando.inventory.dto.SupplierNameDto(s.company) FROM Supplier s")
    List<SupplierNameDto> findAllSupplierNames();
}
