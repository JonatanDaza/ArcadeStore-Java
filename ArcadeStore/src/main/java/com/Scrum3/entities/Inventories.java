package com.Scrum3.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Inventario")
public class Inventories {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int Stock;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product product;

    public Inventories(){

    }

    public Inventories(int Stock){
        this.Stock = Stock;
    }

    public Long getId(){
        return id;
    }

    public int getStock(){
        return Stock;
    }

    public void setStock(int Stock){
        this.Stock = Stock;
    }
}
