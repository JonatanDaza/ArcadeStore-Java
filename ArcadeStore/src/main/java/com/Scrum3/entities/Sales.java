package com.Scrum3.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Ventas")

public class Sales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateSale;
    private Double total;
    private String paymentMethod;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    public Sales(){
    }
    public Sales(LocalDateTime dateSale, Double total, String paymentMethod){
        this.dateSale = dateSale;
        this.total = total;
        this.paymentMethod = paymentMethod;
    }

    public Long getId(){
        return id;
    }

    public LocalDateTime getDateSale(){
        return dateSale;
    }

    public void setDateSale(LocalDateTime dateSale){
        this.dateSale = dateSale;
    }

    public String GetPaymentMethod(){
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod){
        this.paymentMethod = paymentMethod;
    }

    public Double getTotal(){
        return total;
    }

    public void setTotal(Double total){
        this.total = total;
    }

    public User getUser(){
        return user;
    }

    public void setUser(User user){
        this.user = user;
    }
}
