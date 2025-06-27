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
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        boolean result = authService.login(loginRequest.getEmail(), loginRequest.getPasswordHash());

        if (result) {
            return ResponseEntity.ok("Inicio de sesión exitoso");
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
