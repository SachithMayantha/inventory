package com.fernando.inventory.service;

import com.fernando.inventory.dto.OrderDto;
import com.fernando.inventory.entity.Order;
import com.fernando.inventory.mapper.OrderMapper;
import com.fernando.inventory.repository.OrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderService {

    private OrderRepository orderRepository;

    public OrderDto findById(int id) {
        Order order = orderRepository.findById(id).orElse(null);
        assert order != null;
        return OrderMapper.mapToOrderDto(order);
    }

    public OrderDto save(OrderDto orderDto) {
        orderDto.setCreated("2025-01-01");
        LocalDateTime now = LocalDateTime.now();
        int year = now.getYear();
        int month = now.getMonthValue();

        long count = orderRepository.countOrdersInMonth(year, month) + 1;

        String orderId = String.format("ORD_%d_%02d_%03d", year, month, count);

        Order order = OrderMapper.mapToOrder(orderDto);
        order.setOrder_id(orderId);
        order.setCreated(LocalDate.from(now));

        Order savedOrder = orderRepository.save(order);
        return OrderMapper.mapToOrderDto(savedOrder);
    }

    public List<OrderDto> findAll() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(OrderMapper::mapToOrderDto).collect(Collectors.toList());
    }

    public OrderDto update(OrderDto orderDto) {
        Order order = OrderMapper.mapToOrder(orderDto);
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.mapToOrderDto(savedOrder);
    }

    public void delete(int id) {
        orderRepository.deleteById(id);
    }

    public BigDecimal getTotalDeliveredOrderAmount(){
        return orderRepository.getTotalDeliveredOrderAmount();
    }
}
