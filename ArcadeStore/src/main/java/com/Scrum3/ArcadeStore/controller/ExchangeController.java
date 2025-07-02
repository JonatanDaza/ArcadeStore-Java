package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.dto.ExchangeDTO;
import com.Scrum3.ArcadeStore.dto.ExchangeRequest;
import com.Scrum3.ArcadeStore.service.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchanges")
public class ExchangeController {

    @Autowired
    private ExchangeService exchangeService;

    @PostMapping("/create")
    public ResponseEntity<ExchangeDTO> createExchange(@RequestBody ExchangeRequest request, Authentication authentication) {
        ExchangeDTO createdExchange = exchangeService.createExchange(request, authentication);
        return ResponseEntity.ok(createdExchange);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ExchangeDTO>> getAllExchanges() {
        List<ExchangeDTO> exchanges = exchangeService.getAllExchanges();
        return ResponseEntity.ok(exchanges);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExchangeDTO> getExchangeById(@PathVariable Long id) {
        ExchangeDTO exchange = exchangeService.getExchangeById(id);
        if (exchange == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(exchange);
    }

    @GetMapping("/user")
    public ResponseEntity<List<ExchangeDTO>> getUserExchanges(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        List<ExchangeDTO> exchanges = exchangeService.getUserExchanges(authentication);
        return ResponseEntity.ok(exchanges);
    }
}