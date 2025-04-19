package com.fernando.inventory.repository;

import com.fernando.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.status = 'Low Stock'")
    int countLowStockItems();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.status = 'Expiring Soon'")
    int countExpiringSoonItems();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.status IN ('In Stock', 'Low Stock', 'Expiring Soon')")
    int countAvailableInventory();

    List<Inventory> findByStatus(String status);

}
