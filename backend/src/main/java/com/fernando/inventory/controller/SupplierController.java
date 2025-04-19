package com.fernando.inventory.controller;

import com.fernando.inventory.dto.SupplierNameDto;
import com.fernando.inventory.entity.Supplier;
import com.fernando.inventory.service.SupplierService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("supplier")
@AllArgsConstructor
public class SupplierController {

    private SupplierService supplierService;

    @PostMapping("save")
    public Supplier save(@RequestBody Supplier supplier) {
        return supplierService.save(supplier);
    }

    @PutMapping("update")
    public Supplier update(@RequestBody Supplier supplier) {
        return supplierService.update(supplier);
    }

    @GetMapping("{id}")
    public Supplier findById(@PathVariable int id) {
        return supplierService.findById(id);
    }

    @GetMapping("getAll")
    public List<Supplier> findAll() {
        return supplierService.findAll();
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable int id) {
        supplierService.delete(id);
    }

    @GetMapping("/names")
    public List<SupplierNameDto> getSupplierNames() {
        return supplierService.getAllSupplierNames();
    }
}
