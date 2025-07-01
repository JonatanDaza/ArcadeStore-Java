package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Game;
import lombok.Data;

@Data
public class GameDTO { 
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String imagePath;
    private String requisiteMinimum;
    private String requisiteRecommended;
    private boolean active;
    private boolean highlighted;
    private CategoryDTO category;
    private AgreementDTO agreement; // CAMBIADO: Usar DTO en lugar de String

    // Constructor vacío (requerido por Jackson)
    public GameDTO() {}

    // Constructor con Game
    public GameDTO(Game game) {
        this.id = game.getId();
        this.title = game.getTitle();
        this.description = game.getDescription();
        this.price = game.getPrice();
        this.imagePath = game.getImagePath();
        this.requisiteMinimum = game.getRequisiteMinimum();
        this.requisiteRecommended = game.getRequisiteRecommended();
        this.active = game.isActive();
        this.highlighted = game.isHighlighted();
        
        // Mapear categoría de forma segura
        if (game.getCategory() != null) {
            this.category = new CategoryDTO(game.getCategory());
        }
        
        // CORREGIDO: Mapear agreement de forma segura usando DTO
        if (game.getAgreement() != null) {
            this.agreement = new AgreementDTO(game.getAgreement());
        }
    }
}