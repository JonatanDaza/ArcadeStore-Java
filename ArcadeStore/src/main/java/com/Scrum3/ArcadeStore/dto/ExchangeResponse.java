package com.Scrum3.ArcadeStore.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ExchangeResponse {
    private Long id;
    private Long requesterId;
    private Long ownerId;
    private Long offeredGameId;
    private String offeredGameTitle;
    private Long requestedGameId;
    private String requestedGameTitle;
    private String status;
    private LocalDateTime exchangeDate;
    private BigDecimal additionalCost;
    private String costReason;
}