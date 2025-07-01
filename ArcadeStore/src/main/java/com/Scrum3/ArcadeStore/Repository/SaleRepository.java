package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Scrum3.ArcadeStore.entities.Sale;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<com.Scrum3.ArcadeStore.entities.Sale, Long> {
    List<Sale> findByUser(User user);
    Optional<Sale> findByUserAndGameAndActiveTrue(User user, Game game);
}
