package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Sale;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class SaleDTO {
    private Long id;
    private boolean active;
    private LocalDateTime saleDate;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private UserDTO user;
    private GameDTO game;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SaleDTO(Sale sale) {
        this.id = sale.getId();
        this.active = sale.isActive();
        this.saleDate = sale.getSaleDate();
        this.totalAmount = sale.getTotalAmount();
        this.paymentMethod = sale.getPaymentMethod();
        this.createdAt = sale.getCreatedAt();
        this.updatedAt = sale.getUpdatedAt();

        if (sale.getUser() != null) {
            this.user = new UserDTO(sale.getUser());
        }
        if (sale.getGame() != null) {
            this.game = new GameDTO(sale.getGame());
        }
    }
}