package com.Scrum3.ArcadeStore.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "games")
public class Game {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(name = "image_path")
    private String imagePath;
    
    @Column(name = "requisite_minimum", length = 500)
    private String requisiteMinimum;
    
    @Column(name = "requisite_recommended", length = 500)
    private String requisiteRecommended;
    
    @Column(nullable = false)
    private boolean active = true;
    
    @Column(nullable = false)
    private boolean highlighted = false;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({"games", "hibernateLazyInitializer", "handler"}) // Evitar referencia circular
    private Category category;
    
    // CORREGIDO: Relación con Agreement con fetch EAGER para evitar LazyInitializationException
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agreement_id")
    @JsonIgnoreProperties({"games", "hibernateLazyInitializer", "handler"}) // Evitar referencia circular
    private Agreement agreement;
    
    // Constructores
    public Game() {}
    
    public Game(String title, String description, Double price, Category category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
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
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    public Agreement getAgreement() {
        return agreement;
    }
    
    public void setAgreement(Agreement agreement) {
        this.agreement = agreement;
    }
    
    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", active=" + active +
                ", highlighted=" + highlighted +
                ", category=" + (category != null ? category.getName() : "null") +
                ", agreement=" + (agreement != null ? agreement.getCompanyName() : "null") +
                '}';
    }
}