package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Scrum3.ArcadeStore.entities.Sale;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<com.Scrum3.ArcadeStore.entities.Sale, Long> {
    List<Sale> findByUser(User user);
}
