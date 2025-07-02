package com.Scrum3.ArcadeStore.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SaleFilterDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long userId;
    private Long gameId;
    private Boolean active;
}