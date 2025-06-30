package com.Scrum3.ArcadeStore.dto;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequestDTO {
    private List<Long> gameIds;
    private String paymentMethod;
}