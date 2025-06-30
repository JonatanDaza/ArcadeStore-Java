package com.Scrum3.ArcadeStore.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponseDTO {
    private String orderNumber;
    private Long orderId;
    private Long paymentId;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
    private List<GameDTO> purchasedGames;
    private LocalDateTime createdAt;
    
    // Información adicional para el frontend
    private String message;
    private boolean success;
}