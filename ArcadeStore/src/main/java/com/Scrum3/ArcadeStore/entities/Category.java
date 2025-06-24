// Ubicación: src/main/java/com/Scrum3/ArcadeStore/entities/Category.java

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
@Table(name = "categories") // Mapeado a la tabla 'categories' en tu base de datos
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_name", length = 45, nullable = false) // Mapeado a 'category_name'
    private String name;

    @Column(name = "description", columnDefinition = "TEXT") // Mapeado a 'description'
    private String description;

    // --- CAMBIO CLAVE AQUÍ ---
    // Eliminamos 'columnDefinition = "TINYINT(1)"'.
    // Hibernate ahora mapeará 'Boolean active' a 'BOOLEAN' en PostgreSQL automáticamente.
    @Column(name = "is_active") // Mapeado a 'is_active' (ahora correctamente BOOLEAN en PostgreSQL)
    private Boolean active; // Mantenlo como 'Boolean' si puede ser nulo, o 'boolean' si siempre es verdadero/falso

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}