package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Category;
import lombok.Data;

@Data
public class CategoryDTO { 
    private Long id;
    private String name;
    private String description;
    private boolean active;

    // Constructor vacío
    public CategoryDTO() {}

    // Constructor con Category
    public CategoryDTO(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
        this.active = category.isActive();
    }
}