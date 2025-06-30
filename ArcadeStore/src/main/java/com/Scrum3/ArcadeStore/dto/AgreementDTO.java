package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Agreement;
import java.time.LocalDateTime;

public class AgreementDTO {
    private Long id;
    private String companyName;
    private boolean active;
    private String details;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor vacío
    public AgreementDTO() {}

    // Constructor con Agreement
    public AgreementDTO(Agreement agreement) {
        this.id = agreement.getId();
        this.companyName = agreement.getCompanyName();
        this.active = agreement.isActive();
        this.details = agreement.getDetails();
        this.startDate = agreement.getStartDate();
        this.endDate = agreement.getEndDate();
        this.createdAt = agreement.getCreatedAt();
        this.updatedAt = agreement.getUpdatedAt();
        // NO incluir la lista de juegos para evitar referencias circulares
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}