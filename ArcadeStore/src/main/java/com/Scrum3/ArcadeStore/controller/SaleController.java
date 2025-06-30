package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.dto.SaleDTO;
import com.Scrum3.ArcadeStore.dto.CheckoutRequestDTO;
import com.Scrum3.ArcadeStore.dto.CheckoutResponseDTO;
import com.Scrum3.ArcadeStore.entities.Sale;
import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.services.SaleService;
import com.Scrum3.ArcadeStore.services.UserService;
import com.Scrum3.ArcadeStore.services.PdfReportService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(
    origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = {"Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"},
    allowCredentials = "true",
    maxAge = 3600
)
public class SaleController {

    @Autowired
    private SaleService saleService;

    @Autowired
    private PdfReportService pdfReportService;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SaleDTO>> getAllSales() {
        try{
            List<SaleDTO> sales = saleService.getAllSalesAsDTO();
            return new ResponseEntity<>(sales, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(@PathVariable Long id) {
        return saleService.getSaleById(id)
                .map(sale -> new ResponseEntity<>(sale, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> processCheckout(@RequestBody CheckoutRequestDTO request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();

            User user = userService.getUserByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Usuario no autenticado encontrado: " + userEmail));

            // ✅ MEJORADO: Retorna CheckoutResponseDTO completo
            CheckoutResponseDTO response = saleService.createSalesFromCart(request, user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            
            // ✅ MEJORADO: Respuesta de error estructurada
            CheckoutResponseDTO errorResponse = CheckoutResponseDTO.builder()
                .success(false)
                .message("Error al procesar la compra: " + e.getMessage())
                .build();
                
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // ✅ NUEVO: Endpoint para obtener los detalles de una orden para la factura
    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getSaleDetails(@PathVariable Long orderId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            User user = userService.getUserByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Usuario no autenticado encontrado: " + userEmail));

            CheckoutResponseDTO response = saleService.getSaleDetailsByOrderId(orderId, user);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                CheckoutResponseDTO.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        } catch (SecurityException e) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                CheckoutResponseDTO.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al recuperar los detalles de la compra: " + e.getMessage());
        }
    }

    // ============= ENDPOINTS PARA REPORTES PDF =============
    // (Mantener todos los endpoints de reportes existentes)

    @GetMapping("/report/pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<byte[]> generatePdfReport(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            List<Sale> sales = saleService.getAllSales();

            if (sales.isEmpty()) {
                throw new RuntimeException("No hay datos de ventas para generar el reporte");
            }

            byte[] pdfBytes = pdfReportService.generateSalesReport(sales);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "reporte-ventas.pdf");
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Error generando reporte: " + e.getMessage()).getBytes());
        }
    }

    // ... (resto de endpoints de reportes sin cambios)
}