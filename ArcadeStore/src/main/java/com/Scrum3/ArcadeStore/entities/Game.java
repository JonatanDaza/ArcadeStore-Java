package com.Scrum3.ArcadeStore.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo; // <-- Nuevo campo
    private String descripcion; // <-- Nuevo campo
    private Double precio; // <-- Nuevo campo

    @Column(name = "requisite_minimum", columnDefinition = "TEXT")
    private String requisitosMinimos;

    @Column(name = "requisite_recommended", columnDefinition = "TEXT")
    private String requisitosRecomendados;

    @Column(name = "image_path")
    private String imagePath;

    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "agreement_id")
    private Agreement agreement;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void set_active(boolean active) {
        this.active = active;
    }

    public static boolean is_active(Object o) {
        return false;
    }
}