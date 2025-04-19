package com.fernando.inventory.controller;

import com.fernando.inventory.dto.InventoryDto;
import com.fernando.inventory.entity.Inventory;
import com.fernando.inventory.service.InventoryService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("inventory")
@AllArgsConstructor
@CrossOrigin
public class InventoryController {

    private InventoryService inventoryService;

    @GetMapping("getAll")
    public List<InventoryDto> findAll() {
        return inventoryService.findAll();
    }

    @GetMapping("{id}")
    public InventoryDto findById(@PathVariable int id) {
        return inventoryService.findById(id);
    }

    @PostMapping("save")
    public InventoryDto save( @RequestBody InventoryDto inventoryDto) {
        System.out.println("Controller");
        return inventoryService.save(inventoryDto);
    }

    @PutMapping("update")
    public InventoryDto update(@RequestBody InventoryDto inventoryDto) {
        return inventoryService.update(inventoryDto);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable int id) {
        inventoryService.delete(id);
    }

    @GetMapping("low-stock")
    public int countLowStockItems() {
        return inventoryService.countLowStockItems();
    }

    @GetMapping("expiring-soon")
    public int countExpiringSoonItems() {
        return inventoryService.countExpiringSoonItems();
    }

    @GetMapping("available")
    public int countAvailableItems() {
        return inventoryService.countAvailableInventory();
    }

    @GetMapping("low-stock-all")
    public List<InventoryDto> findLowStockItems() {
        return inventoryService.findByStatus("Low Stock");
    }

    @GetMapping("expiring-soon-all")
    public List<InventoryDto> findExpiringSoonItems() {
        return inventoryService.findByStatus("Expiring Soon");
    }

    @GetMapping("out-of-stock-all")
    public List<InventoryDto> findOutOfStockItems() {
        return inventoryService.findByStatus("Out of Stock");
    }
}
