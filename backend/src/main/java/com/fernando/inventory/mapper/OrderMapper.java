package com.fernando.inventory.mapper;

import com.fernando.inventory.dto.OrderDto;
import com.fernando.inventory.entity.Order;

import java.math.BigDecimal;
import java.time.LocalDate;

public class OrderMapper {

    public static OrderDto mapToOrderDto(Order order){
        return new OrderDto(
                order.getOrder_id(),
                order.getName(),
                order.getCategory(),
                order.getSupplier(),
                String.valueOf(order.getCreated()),
                String.valueOf(order.getDelivery()),
                order.getStatus(),
                String.valueOf(order.getQuantity()),
                order.getUnit(),
                String.valueOf(order.getPrice())
        );
    }

    public static Order mapToOrder(OrderDto orderDto){
        return new Order(
                orderDto.getOrder_id(),
                orderDto.getName(),
                orderDto.getCategory(),
                orderDto.getSupplier(),
                LocalDate.parse(orderDto.getCreated()),
                LocalDate.parse(orderDto.getDelivery()),
                orderDto.getStatus(),
                new BigDecimal(orderDto.getQuantity()),
                orderDto.getUnit(),
                new BigDecimal(orderDto.getPrice())
        );
    }
}
