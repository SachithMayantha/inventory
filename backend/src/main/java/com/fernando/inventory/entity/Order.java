package com.fernando.inventory.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    private String order_id;
    private String name;
    private String category;
    private String supplier;
    private LocalDate created;
    private LocalDate delivery;
    private String status;
    private BigDecimal quantity;
    private String unit;
    private BigDecimal price;

}
