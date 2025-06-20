package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
}
