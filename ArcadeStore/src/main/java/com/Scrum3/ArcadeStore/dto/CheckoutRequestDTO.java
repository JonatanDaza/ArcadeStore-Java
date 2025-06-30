package com.Scrum3.ArcadeStore.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CheckoutRequestDTO {
    private List<Long> gameIds;
    private String paymentMethod;
}