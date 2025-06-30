package com.Scrum3.ArcadeStore.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "agreements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Agreement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name")
    private String companyName;

    private boolean active = true;

    @Column(name = "details", length = 100, nullable = false)
    private String details;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // CORREGIDO: Usar JsonIgnoreProperties para evitar serialización circular
    @OneToMany(mappedBy = "agreement", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"agreement", "category", "hibernateLazyInitializer", "handler"})
    private List<Game> games;

    public List<Game> getGames() {
        return games;
    }
    
    @Override
    public String toString() {
        return "Agreement{" +
                "id=" + id +
                ", companyName='" + companyName + '\'' +
                ", active=" + active +
                ", details='" + details + '\'' +
                '}';
    }
}