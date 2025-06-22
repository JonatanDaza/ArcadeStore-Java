package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}