package com.fernando.inventory.mapper;

import com.fernando.inventory.dto.InventoryDto;
import com.fernando.inventory.entity.Inventory;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InventoryMapper {

    public static Inventory mapToInventory(InventoryDto inventoryDto) {
        return new Inventory(
                inventoryDto.getInventory_id(),
                inventoryDto.getName(),
                inventoryDto.getCategory(),
                new BigDecimal(inventoryDto.getQuantity()),
                inventoryDto.getUnit(),
                inventoryDto.getStatus(),
                LocalDate.parse(inventoryDto.getExp_date())
        );
    }

    public static InventoryDto mapToInventoryDto(Inventory inventory) {
        return new InventoryDto(
                inventory.getInventory_id(),
                inventory.getName(),
                inventory.getCategory(),
                String.valueOf(inventory.getQuantity()),
                inventory.getUnit(),
                inventory.getStatus(),
                String.valueOf(inventory.getExp_date())
        );
    }
}
