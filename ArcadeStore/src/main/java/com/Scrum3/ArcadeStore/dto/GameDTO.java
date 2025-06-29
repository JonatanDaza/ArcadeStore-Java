package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Game;

public class GameDTO {
    private Long id;
    private String titulo; // Cambia 'name' por 'titulo'
    private boolean active;
    private String agreement;

    public GameDTO(Game game) {
        this.id = game.getId();
        this.titulo = game.getTitulo(); // Cambia esto
        this.active = game.isActive();
        this.agreement = game.getAgreement() != null ? game.getAgreement().getCompanyName() : null;
    }

    // getters y setters...
}
