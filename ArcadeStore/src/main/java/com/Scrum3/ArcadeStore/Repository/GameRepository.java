package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    
    // Métodos existentes
    List<Game> findByAgreementId(Long agreementId);
    boolean existsByAgreementIdAndActiveTrue(Long agreementId);
    boolean existsByCategoryIdAndActiveTrue(Long categoryId);
    
    // Métodos para la tienda pública
    List<Game> findByActiveTrue();
    List<Game> findByActiveTrueAndHighlightedTrue();
    List<Game> findByActiveTrueAndCategoryId(Long categoryId);
    List<Game> findByActiveTrueAndPrice(BigDecimal price);
    List<Game> findByActiveTrueAndPriceGreaterThan(BigDecimal price);
    List<Game> findTop6ByActiveTrueOrderByIdDesc();

    // Métodos adicionales para administración
    List<Game> findByActive(boolean active);
    List<Game> findByHighlighted(boolean highlighted);
}