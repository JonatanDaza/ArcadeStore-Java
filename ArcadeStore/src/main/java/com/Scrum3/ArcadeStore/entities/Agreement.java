package com.Scrum3.ArcadeStore.entities;

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
@Table(name = "agreements") // Mapped to the 'agreements' table in your database
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

    @Column(name = "details", length = 100, nullable = false) // Mapped to 'agreement_type'
    private String details;

    @Column(name = "start_date", nullable = false) // Mapped to 'start_date'
    private LocalDateTime startDate;

    @Column(name = "end_date") // Mapped to 'end_date' (can be nullable in DB)
    private LocalDateTime endDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "agreement")
    private List<Game> games;

    public List<Game> getGames() {return games;}
}