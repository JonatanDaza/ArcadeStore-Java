package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.Repository.ExchangeRepository;
import com.Scrum3.ArcadeStore.dto.ExchangeDTO;
import com.Scrum3.ArcadeStore.dto.ExchangeRequest;
import com.Scrum3.ArcadeStore.entities.Exchange;
import com.Scrum3.ArcadeStore.service.ExchangeService;
import com.Scrum3.ArcadeStore.services.PdfReportService;
import com.Scrum3.ArcadeStore.Repository.ExchangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchanges")
public class ExchangeController {

    @Autowired
    private ExchangeService exchangeService;
    @Autowired
    private PdfReportService pdfReportService;
    @Autowired
    private ExchangeRepository exchangeRepository;

    @PostMapping("/create")
    public ResponseEntity<ExchangeDTO> createExchange(@RequestBody ExchangeRequest request, Authentication authentication) {
        ExchangeDTO createdExchange = exchangeService.createExchange(request, authentication);
        return ResponseEntity.ok(createdExchange);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> completeExchange(@PathVariable Long id, Authentication authentication) {
        exchangeService.completeExchange(id, authentication);
        return ResponseEntity.ok().build();
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

    @GetMapping("/{id}/report")
    @PreAuthorize("hasRole('ADMIN') or @exchangeSecurityService.isOwner(authentication, #id)")
    public ResponseEntity<?> downloadExchangeReportById(@PathVariable Long id) {
        try {
            Exchange exchange = exchangeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Intercambio no encontrado"));

            byte[] pdfBytes = pdfReportService.generateExchangeReport(exchange);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename("reporte_intercambio_" + id + ".pdf").build());

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generando el PDF del intercambio: " + e.getMessage());
        }
    }
}