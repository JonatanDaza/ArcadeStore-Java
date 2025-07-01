package com.Scrum3.ArcadeStore.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Data
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
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
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

    // ✅ AÑADIDO: Relación para saber quién es el dueño actual del juego.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // Columna en la tabla 'games' que guarda el ID del dueño
    private User user;
    
    // CORREGIDO: Relación con Agreement con fetch EAGER para evitar LazyInitializationException
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agreement_id")
    @JsonIgnoreProperties({"games", "hibernateLazyInitializer", "handler"}) // Evitar referencia circular
    private Agreement agreement;
    
    // Constructores
    public Game() {}
    
    public Game(String title, String description, BigDecimal price, Category category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
    }
}