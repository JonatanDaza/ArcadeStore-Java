package com.Scrum3.ArcadeStore.dto;

import lombok.Data;

@Data
public class LoginRequest { 
    private String email;
    private String passwordHash;
}
