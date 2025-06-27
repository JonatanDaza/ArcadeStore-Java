package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.dto.LoginRequest;
import com.Scrum3.ArcadeStore.dto.RegisterRequest;
import com.Scrum3.ArcadeStore.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class    AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String token = authService.loginAndGetToken(loginRequest.getEmail(), loginRequest.getPasswordHash());

        if (token != null) {
            return ResponseEntity.ok().body("{\"token\": \"" + token + "\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String answer = authService.register(request);

        if (answer.contains("exitosamente")) {
            return ResponseEntity.ok(answer);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(answer);
        }
    }
}
