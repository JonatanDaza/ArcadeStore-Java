package com.Scrum3.ArcadeStore.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.math.BigDecimal; // Import BigDecimal

@Entity
@Table(name = "exchanges") // Mapped to the 'exchanges' table in your database
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exchange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exchange_status", length = 50) // Mapped to 'exchange_status'
    private String tradeStatus;

    @Column(name = "exchange_date") // Mapped to 'exchange_date'
    private LocalDateTime tradeDate;

    @Column(name = "additional_cost", precision = 10, scale = 2) // Precision and scale for monetary values
    private BigDecimal additionalCost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // FK column in the 'exchanges' table
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false) // FK column in the 'exchanges' table
    private Game game;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
