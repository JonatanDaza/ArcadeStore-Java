package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Agreement;
import lombok.Data;
import java.time.LocalDateTime;

@Data
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
}