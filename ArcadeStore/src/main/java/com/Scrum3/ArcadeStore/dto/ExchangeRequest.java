package com.Scrum3.ArcadeStore.dto;

import lombok.Data;

@Data
public class ExchangeRequest {
    private Long offeredGameId;
    private Long requestedGameId;
}