package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Game;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor //Asegura que exista un constructor vacío
public class GameDTO {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String imagePath;
    private String requisiteMinimum;
    private String requisiteRecommended;
    private boolean active;
    private boolean highlighted;
    private CategoryDTO category;
    private AgreementDTO agreement;

    /**
     * Constructor para convertir una entidad Game a un GameDTO.
     * Este constructor se encarga de todo el mapeo.
     */
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

        // Mapear la categoría anidada si existe
        if (game.getCategory() != null) {
            this.category = new CategoryDTO(game.getCategory());
        }

        // Mapear el convenio anidado si existe
        if (game.getAgreement() != null) {
            this.agreement = new AgreementDTO(game.getAgreement());
        }
    }
}