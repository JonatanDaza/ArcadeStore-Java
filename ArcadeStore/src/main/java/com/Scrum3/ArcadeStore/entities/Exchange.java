package com.Scrum3.ArcadeStore.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "exchanges")
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
}