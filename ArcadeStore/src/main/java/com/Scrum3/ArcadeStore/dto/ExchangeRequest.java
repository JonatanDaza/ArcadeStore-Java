package com.Scrum3.ArcadeStore.dto;

public class ExchangeRequest {

    private Long offeredGameId;
    private Long requestedGameId;

    // Getters y Setters

    public Long getOfferedGameId() {
        return offeredGameId;
    }

    public void setOfferedGameId(Long offeredGameId) {
        this.offeredGameId = offeredGameId;
    }

    public Long getRequestedGameId() {
        return requestedGameId;
    }

    public void setRequestedGameId(Long requestedGameId) {
        this.requestedGameId = requestedGameId;
    }
}
