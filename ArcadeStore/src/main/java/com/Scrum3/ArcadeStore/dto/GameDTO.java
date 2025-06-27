package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Game;

public class GameDTO {
    private Long id;
    private String name;
    private boolean active;
    private String agreement;

    public GameDTO(Game game) {
        this.id = game.getId();
        this.name = game.getName();
        this.name = String.valueOf(Game.is_active(game));
        this.agreement = game.getAgreement().getCompanyName();
    }
}
