package com.fernando.inventory.service;

import com.fernando.inventory.dto.InventoryDto;
import com.fernando.inventory.entity.Inventory;
import com.fernando.inventory.mapper.InventoryMapper;
import com.fernando.inventory.repository.InventoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InventoryService {

    private InventoryRepository inventoryRepository;

    public List<InventoryDto> findAll() {
        List<Inventory> inventoryList = inventoryRepository.findAll();
        return inventoryList.stream().map(InventoryMapper::mapToInventoryDto).collect(Collectors.toList());
    }

    public InventoryDto findById(int id) {
        Inventory inventory = inventoryRepository.findById(id).orElse(null);
        assert inventory != null;
        return InventoryMapper.mapToInventoryDto(inventory);
    }

    public InventoryDto save(InventoryDto inventoryDto) {
        System.out.println(inventoryDto.getQuantity());
        Inventory inventory = InventoryMapper.mapToInventory(inventoryDto);
        Inventory inventorySaved = inventoryRepository.save(inventory);
        return InventoryMapper.mapToInventoryDto(inventorySaved);
    }

    public InventoryDto update(InventoryDto inventoryDto) {
        Inventory inventory = InventoryMapper.mapToInventory(inventoryDto);
        Inventory inventorySaved = inventoryRepository.save(inventory);
        return InventoryMapper.mapToInventoryDto(inventorySaved);
    }

    public void delete(int id) {
        Inventory inventory = inventoryRepository.findById(id).orElse(null);
        assert inventory != null;
        inventoryRepository.delete(inventory);
    }

    public int countLowStockItems(){
        return inventoryRepository.countLowStockItems();
    }

    public int countExpiringSoonItems(){
        return inventoryRepository.countExpiringSoonItems();
    }

    public int countAvailableInventory(){
        return inventoryRepository.countAvailableInventory();
    }

    public List<InventoryDto> findByStatus(String status) {
        List<Inventory> inventoryList = inventoryRepository.findByStatus(status);
        return inventoryList.stream().map(InventoryMapper::mapToInventoryDto).collect(Collectors.toList());
    }
}
