package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.Repository.ExchangeRepository;
import com.Scrum3.ArcadeStore.dto.ExchangeRequest;
import com.Scrum3.ArcadeStore.entities.Exchange;
import com.Scrum3.ArcadeStore.service.ExchangeService;
import com.Scrum3.ArcadeStore.services.PdfReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
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
    @Autowired
    private PdfReportService pdfReportService;
    @Autowired
    private ExchangeRepository exchangeRepository;

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
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

    @GetMapping("/my-exchanges")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserExchanges(Authentication authentication) {
        try {
            List<ExchangeResponse> exchanges = exchangeService.getUserExchanges(authentication);
            return ResponseEntity.ok(exchanges);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/report")
    @PreAuthorize("hasRole('ADMIN') or @exchangeSecurityService.isOwner(authentication, #id)")
    public ResponseEntity<?> getExchangeReportById(@PathVariable Long id) {
        try {
            Exchange exchange = exchangeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Intercambio no encontrado"));

            byte[] pdfBytes = pdfReportService.generateExchangeReport(exchange); // usa método individual
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename("intercambio_" + id + ".pdf").build());

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generando el PDF del intercambio: " + e.getMessage());
        }
    }
}