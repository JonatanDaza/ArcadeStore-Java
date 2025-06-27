package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.entities.Exchange;
import com.Scrum3.ArcadeStore.services.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchanges")
public class ExchangeController {

    @Autowired
    private ExchangeService exchangeService;

    @GetMapping
    public ResponseEntity<List<Exchange>> getAllExchanges() {
        List<Exchange> exchanges = exchangeService.getAllExchanges();
        return new ResponseEntity<>(exchanges, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exchange> getExchangeById(@PathVariable Long id) {
        return exchangeService.getExchangeById(id)
                .map(exchange -> new ResponseEntity<>(exchange, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Exchange> createExchange(@RequestBody Exchange exchange) {
        Exchange createdExchange = exchangeService.createExchange(exchange);
        return new ResponseEntity<>(createdExchange, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exchange> updateExchange(@PathVariable Long id, @RequestBody Exchange exchangeDetails) {
        Exchange updatedExchange = exchangeService.updateExchange(id, exchangeDetails);
        if (updatedExchange != null) {
            return new ResponseEntity<>(updatedExchange, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
