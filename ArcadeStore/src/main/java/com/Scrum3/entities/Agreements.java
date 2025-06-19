package com.Scrum3.entities;

import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
@Table(name = "Convenios")
public class Agreements {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product product;

    public Agreements(){

    }
    public Agreements(String description, LocalDateTime startDate, LocalDateTime endDate){
        this.description = description;
        this.endDate = endDate;
        this.startDate = startDate;
    }

    public Long getId(){
        return id;
    }

    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public LocalDateTime getStartDate(){
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate){
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate(){
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate){
        this.endDate = endDate;
    }

}
