package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Game;

public class GameDTO {
    private Long id;
    private String title; // Cambia 'name' por 'titulo'
    private boolean active;
    private String agreement;

    public GameDTO(Game game) {
        this.id = game.getId();
        this.title = game.getTitle(); // Cambia esto
        this.active = game.isActive();
        // Si tienes agreement:
        if (game.getAgreement() != null) {
            this.agreement = game.getAgreement().getCompanyName();
        }
    }

    // getters y setters...
}
