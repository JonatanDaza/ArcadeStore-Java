package com.Scrum3.ArcadeStore.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ExchangeResponse {
    private Long id;
    private Long requesterId;
    private Long ownerId;
    private Long offeredGameId;
    private Long requestedGameId;
    private String status;
    private LocalDateTime exchangeDate;
}

