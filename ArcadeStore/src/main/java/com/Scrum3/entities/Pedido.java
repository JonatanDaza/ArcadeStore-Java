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

}