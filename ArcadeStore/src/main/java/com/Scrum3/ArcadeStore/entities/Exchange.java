package com.Scrum3.ArcadeStore.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "exchange")
@Data
public class Exchange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = true)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offered_game_id", nullable = false)
    private Game offeredGame;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_game_id", nullable = false)
    private Game requestedGame;

    @Column(nullable = false)
    private String status;

    @Column(name = "exchange_date", nullable = false)
    private LocalDateTime exchangeDate;

    @Column(name = "additional_cost", precision = 10, scale = 2)
    private BigDecimal additionalCost;

    public void setExchangeDate(LocalDateTime exchangeDate) {
        this.exchangeDate = exchangeDate;
    }

    public BigDecimal getAdditionalCost() {
        return additionalCost;
    }

    public void setAdditionalCost(BigDecimal additionalCost) {
        this.additionalCost = additionalCost;
    }
}