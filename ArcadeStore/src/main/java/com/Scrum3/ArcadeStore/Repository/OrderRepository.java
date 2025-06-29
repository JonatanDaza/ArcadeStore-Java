package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
}