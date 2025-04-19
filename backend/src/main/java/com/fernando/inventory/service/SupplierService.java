package com.fernando.inventory.service;

import com.fernando.inventory.dto.SupplierNameDto;
import com.fernando.inventory.entity.Supplier;
import com.fernando.inventory.repository.SupplierRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SupplierService {

    private SupplierRepository supplierRepository;

    public Supplier save(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier findById(int id) {
        return supplierRepository.findById(id).orElse(null);
    }

    public List<Supplier> findAll() {
        return supplierRepository.findAll();
    }

    public Supplier update(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public void delete(int id) {
        supplierRepository.deleteById(id);
    }

    public List<SupplierNameDto> getAllSupplierNames() {
        return supplierRepository.findAllSupplierNames();
    }
}
