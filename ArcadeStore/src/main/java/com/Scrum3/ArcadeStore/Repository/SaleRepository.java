package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Sale;
import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long>, JpaSpecificationExecutor<Sale> {

    // Buscar ventas activas de un usuario
    List<Sale> findByUserAndActiveTrue(User user);
    
    // Buscar una venta específica activa de un usuario para un juego
    Optional<Sale> findByUserAndGameAndActiveTrue(User user, Game game);
    
    // Verificar si un usuario posee un juego específico (venta activa)
    boolean existsByUserAndGameAndActiveTrue(User user, Game game);
    
    // Buscar todas las ventas de un usuario
    List<Sale> findByUser(User user);
    
    // Buscar ventas por juego
    List<Sale> findByGame(Game game);
    
    // Buscar ventas activas por usuario ID
    @Query("SELECT s FROM Sale s WHERE s.user.id = :userId AND s.active = true")
    List<Sale> findActiveByUserId(@Param("userId") Long userId);
    
    // Contar cuántos juegos activos tiene un usuario
    @Query("SELECT COUNT(s) FROM Sale s WHERE s.user.id = :userId AND s.active = true")
    Long countActiveGamesByUserId(@Param("userId") Long userId);
    
    // Buscar ventas en un rango de fechas
    @Query("SELECT s FROM Sale s WHERE s.user = :user AND s.saleDate BETWEEN :startDate AND :endDate")
    List<Sale> findByUserAndSaleDateBetween(
        @Param("user") User user, 
        @Param("startDate") java.time.LocalDateTime startDate, 
        @Param("endDate") java.time.LocalDateTime endDate
    );
    
    // Buscar todas las ventas activas
    List<Sale> findByActiveTrue();
    
    // Buscar ventas por orden
    List<Sale> findByOrderId(Long orderId);
}