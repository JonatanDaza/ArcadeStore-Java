package com.Scrum3.ArcadeStore.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleRepository extends JpaRepository<com.Scrum3.ArcadeStore.entities.Sale, Long> {
}
