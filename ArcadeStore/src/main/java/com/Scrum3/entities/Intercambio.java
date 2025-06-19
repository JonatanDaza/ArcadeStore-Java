package com.Scrum3.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Intercambios")
public class Intercambio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tradeStatus;
    private LocalDateTime tradeDate;
    private Double additionalCost;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product product;

    public Intercambio(){

    }

    public Intercambio(String tradeStatus, LocalDateTime tradeDate, Double additionalCost){
        this.additionalCost = additionalCost;
        this.tradeDate = tradeDate;
        this.tradeStatus = tradeStatus;
    }
    public Long getId(){
        return id;
    }

    public String getTradeStatus(){
        return tradeStatus;
    }

    public void setTradeStatus(String tradeStatus){
        this.tradeStatus = tradeStatus;
    }
    public Double getAdditionalCost(){
        return additionalCost;
    }

    public void setAdditionalCost(Double additionalCost){
        this.additionalCost = additionalCost;
    }

    public LocalDateTime getTradeDate(){
        return tradeDate;
    }
    public void setTradeDate(LocalDateTime tradeDate){
        this.tradeDate = tradeDate;
    }
}




