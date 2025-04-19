package com.fernando.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryDto {
    private int inventory_id;
    private String name;
    private String category;
    private String quantity;
    private String unit;
    private String status;
    private String exp_date;
}
