package com.Scrum3.ArcadeStore.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String passwordHash;
    private String username;
}
