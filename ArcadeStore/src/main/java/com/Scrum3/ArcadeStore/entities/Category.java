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
@Table(name = "categories") // Mapped to the 'categories' table in your database
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_name", length = 45, nullable = false) // Mapped to 'category_name'
    private String name;

    @Column(name = "description", columnDefinition = "TEXT") // Mapped to 'description'
    private String description;

    @Column(name = "is_active", columnDefinition = "TINYINT(1)") // Mapped to 'is_active' (BOOLEAN)
    private Boolean active;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}