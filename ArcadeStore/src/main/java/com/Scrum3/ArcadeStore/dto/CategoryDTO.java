package com.Scrum3.ArcadeStore.dto;

import com.Scrum3.ArcadeStore.entities.Category;

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

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}