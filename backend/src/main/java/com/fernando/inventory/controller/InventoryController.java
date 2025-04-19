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
}
