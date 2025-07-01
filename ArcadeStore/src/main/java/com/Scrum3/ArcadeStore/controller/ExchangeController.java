package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.dto.ExchangeRequest;
import com.Scrum3.ArcadeStore.service.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.Scrum3.ArcadeStore.dto.ExchangeResponse;
import java.util.List;

@RestController
@RequestMapping("/api/exchanges")
@CrossOrigin(
    origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = {"Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"},
    allowCredentials = "true",
    maxAge = 3600
)
public class ExchangeController {

    @Autowired
    private ExchangeService exchangeService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')") // Solo usuarios autenticados pueden intercambiar
    public ResponseEntity<?> createExchange(@RequestBody ExchangeRequest request, Authentication authentication) {
        try {
            ExchangeResponse newExchange = exchangeService.createExchange(request, authentication);
            return ResponseEntity.ok(newExchange);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ExchangeResponse>> getAllExchanges() {
        List<ExchangeResponse> exchanges = exchangeService.getAllExchanges();
        return ResponseEntity.ok(exchanges);
    }

     @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @exchangeSecurityService.isOwner(authentication, #id)")
    public ResponseEntity<?> getExchangeById(@PathVariable Long id) {
        try {
            ExchangeResponse exchange = exchangeService.getExchangeById(id);
            return ResponseEntity.ok(exchange);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
