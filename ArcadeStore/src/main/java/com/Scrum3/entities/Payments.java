package com.Scrum3.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Pagos")
public class Payments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String paymentMethod;
    private int total;

    @ManyToOne
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_intercambio")
    private Intercambio intercambio;

    public Payments(){

    }
    public Payments(String paymentMethod, int total){
        this.paymentMethod = paymentMethod;
        this.total = total;
    }

    public Long getId(){
        return id;
    }

    public String getPaymentMethod(){
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod){
        this.paymentMethod = paymentMethod;
    }

    public int getTotal(){
        return total;
    }

    public void setTotal(int total){
        this.total = total;
    }

}
