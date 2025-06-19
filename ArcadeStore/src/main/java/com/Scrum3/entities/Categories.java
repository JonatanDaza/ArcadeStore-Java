package com.Scrum3.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Categorias")
public class Categories {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private String status;

    public Categories(){

    }

    public Categories(String description, String status){
        this.description = description;
        this.status = status;
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

    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }

}
