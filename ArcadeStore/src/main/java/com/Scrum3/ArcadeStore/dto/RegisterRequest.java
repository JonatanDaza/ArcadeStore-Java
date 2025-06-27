package com.Scrum3.ArcadeStore.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String email;
    private String passwordHash;
    private String username;
}
