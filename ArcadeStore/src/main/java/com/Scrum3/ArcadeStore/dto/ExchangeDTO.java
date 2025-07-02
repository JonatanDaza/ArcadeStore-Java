package com.Scrum3.ArcadeStore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ExchangeDTO {

    private Long id;
    private Long requesterId;
    private String requesterUsername;
    private Long offeredGameId;
    private String offeredGameTitle;
    private Long requestedGameId;
    private String requestedGameTitle;
    private String status;
    private LocalDateTime exchangeDate;
    private BigDecimal additionalCost;
    private String costReason;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
    }

    public String getRequesterUsername() {
        return requesterUsername;
    }

    public void setRequesterUsername(String requesterUsername) {
        this.requesterUsername = requesterUsername;
    }

    public Long getOfferedGameId() {
        return offeredGameId;
    }

    public void setOfferedGameId(Long offeredGameId) {
        this.offeredGameId = offeredGameId;
    }

    public String getOfferedGameTitle() {
        return offeredGameTitle;
    }

    public void setOfferedGameTitle(String offeredGameTitle) {
        this.offeredGameTitle = offeredGameTitle;
    }

    public Long getRequestedGameId() {
        return requestedGameId;
    }

    public void setRequestedGameId(Long requestedGameId) {
        this.requestedGameId = requestedGameId;
    }

    public String getRequestedGameTitle() {
        return requestedGameTitle;
    }

    public void setRequestedGameTitle(String requestedGameTitle) {
        this.requestedGameTitle = requestedGameTitle;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getExchangeDate() { return exchangeDate; }
    public void setExchangeDate(LocalDateTime exchangeDate) { this.exchangeDate = exchangeDate; }
    public BigDecimal getAdditionalCost() { return additionalCost; }
    public void setAdditionalCost(BigDecimal additionalCost) { this.additionalCost = additionalCost; }
    public String getCostReason() { return costReason; }
    public void setCostReason(String costReason) { this.costReason = costReason; }
}