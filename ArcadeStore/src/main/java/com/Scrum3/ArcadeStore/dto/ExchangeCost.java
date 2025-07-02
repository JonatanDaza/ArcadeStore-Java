package com.Scrum3.ArcadeStore.dto;

import java.math.BigDecimal;

public class ExchangeCost {

    private BigDecimal offeredGamePrice;
    private BigDecimal requestedGamePrice;
    private BigDecimal priceDifference;
    private BigDecimal additionalCost;
    private String reason;

    // Getters y Setters

    public BigDecimal getOfferedGamePrice() {
        return offeredGamePrice;
    }

    public void setOfferedGamePrice(BigDecimal offeredGamePrice) {
        this.offeredGamePrice = offeredGamePrice;
    }

    public BigDecimal getRequestedGamePrice() {
        return requestedGamePrice;
    }

    public void setRequestedGamePrice(BigDecimal requestedGamePrice) {
        this.requestedGamePrice = requestedGamePrice;
    }

    public BigDecimal getPriceDifference() {
        return priceDifference;
    }

    public void setPriceDifference(BigDecimal priceDifference) {
        this.priceDifference = priceDifference;
    }

    public BigDecimal getAdditionalCost() {
        return additionalCost;
    }

    public void setAdditionalCost(BigDecimal additionalCost) {
        this.additionalCost = additionalCost;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}