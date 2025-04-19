package com.fernando.inventory.repository;

import com.fernando.inventory.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.created) = :year AND MONTH(o.created) = :month")
    long countOrdersInMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT SUM(o.price) FROM Order o WHERE o.status = 'Delivered'")
    BigDecimal getTotalDeliveredOrderAmount();

}
