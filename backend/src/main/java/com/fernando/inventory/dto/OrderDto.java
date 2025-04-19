package com.fernando.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {

    private String order_id;
    private String name;
    private String category;
    private String supplier;
    private String created;
    private String delivery;
    private String status;
    private String quantity;
    private String unit;
    private String price;
}
