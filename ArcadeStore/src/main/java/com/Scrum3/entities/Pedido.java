package com.Scrum3.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateOrder;
    private String orderStatus;
    private int Stock;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    public Pedido(){

    }

    public Pedido(LocalDateTime dateOrder, String orderStatus, int stock){
        this.dateOrder = dateOrder;
        this.orderStatus = orderStatus;
        this.Stock = stock;
    }

    public Long getId(){
        return id;
    }

    public LocalDateTime getDateOrder(){
        return dateOrder;
    }

    public void setDateOrder(LocalDateTime dateOrder){
        this.dateOrder = dateOrder;
    }

    public String getOrderStatus(){
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus){
        this.orderStatus = orderStatus;
    }

    public int getStock(){
        return Stock;
    }

    public void setStock(int Stock){
        this.Stock = Stock;
    }

}