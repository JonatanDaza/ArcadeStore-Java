package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Game;

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

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getRequisiteMinimum() {
        return requisiteMinimum;
    }

    public void setRequisiteMinimum(String requisiteMinimum) {
        this.requisiteMinimum = requisiteMinimum;
    }

    public String getRequisiteRecommended() {
        return requisiteRecommended;
    }

    public void setRequisiteRecommended(String requisiteRecommended) {
        this.requisiteRecommended = requisiteRecommended;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isHighlighted() {
        return highlighted;
    }

    public void setHighlighted(boolean highlighted) {
        this.highlighted = highlighted;
    }

    public CategoryDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryDTO category) {
        this.category = category;
    }

    public AgreementDTO getAgreement() {
        return agreement;
    }

    public void setAgreement(AgreementDTO agreement) {
        this.agreement = agreement;
    }
}