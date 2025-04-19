package com.fernando.inventory.controller;

import com.fernando.inventory.dto.OrderDto;
import com.fernando.inventory.entity.Order;
import com.fernando.inventory.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("order")
@CrossOrigin
@AllArgsConstructor
public class OrderController {

    private OrderService orderService;

    @PostMapping("save")
    public OrderDto save(@RequestBody OrderDto orderDto) {
        return orderService.save(orderDto);
    }

    @GetMapping("{order_id}")
    public OrderDto getOrderById(@PathVariable int order_id) {
        return orderService.findById(order_id);
    }

    @GetMapping("getAll")
    public List<OrderDto> getAllOrders() {
        return orderService.findAll();
    }

    @PutMapping("update")
    public OrderDto updateOrder(@RequestBody OrderDto orderDto) {
        return orderService.update(orderDto);
    }

    @DeleteMapping("{order_id}")
    public void deleteOrder(@PathVariable int order_id) {
        orderService.delete(order_id);
    }
}
