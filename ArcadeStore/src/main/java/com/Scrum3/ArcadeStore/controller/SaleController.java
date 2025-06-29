package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.entities.Sale;
import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.services.SaleService;
import com.Scrum3.ArcadeStore.services.PdfReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
@CrossOrigin(origins = "*")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @Autowired
    private PdfReportService pdfReportService;

    @GetMapping("/all")
    public ResponseEntity<List<Sale>> getAllSales() {
        List<Sale> sales = saleService.getAllSales();
        return new ResponseEntity<>(sales, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(@PathVariable Long id) {
        return saleService.getSaleById(id)
                .map(sale -> new ResponseEntity<>(sale, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // ============= ENDPOINTS PARA REPORTES PDF =============

    @GetMapping("/report/pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<byte[]> generatePdfReport(HttpServletRequest request) {
        try {
            // Obtener el token del header
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Obtener todas las ventas desde la base de datos
            List<Sale> sales = saleService.getAllSales();

            if (sales.isEmpty()) {
                throw new RuntimeException("No hay datos de ventas para generar el reporte");
            }

            // Generar el PDF con los datos
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

    @PostMapping("/report/pdf-with-data")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<byte[]> generatePdfReportWithData(
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {
        try {
            // Extraer los datos de ventas del body
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> salesData = (List<Map<String, Object>>) requestBody.get("sales");

            if (salesData == null || salesData.isEmpty()) {
                throw new RuntimeException("No se proporcionaron datos de ventas");
            }

            // Convertir los datos del frontend a objetos Sale
            List<Sale> sales = convertToSaleObjects(salesData);

            // Generar el PDF
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

    @PostMapping("/report/pdf-filtered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<byte[]> generateFilteredPdfReport(
            @RequestBody Map<String, Object> filters,
            HttpServletRequest request) {
        try {
            // Aplicar filtros a las ventas
            List<Sale> filteredSales = saleService.getSalesWithFilters(filters);

            if (filteredSales.isEmpty()) {
                throw new RuntimeException("No hay datos que coincidan con los filtros");
            }

            // Generar el PDF
            byte[] pdfBytes = pdfReportService.generateSalesReport(filteredSales);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "reporte-ventas-filtrado.pdf");
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Error generando reporte filtrado: " + e.getMessage()).getBytes());
        }
    }

    @GetMapping("/report/pdf-preview")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<byte[]> generatePdfPreview(HttpServletRequest request) {
        try {
            List<Sale> sales = saleService.getAllSales();

            if (sales.isEmpty()) {
                throw new RuntimeException("No hay datos de ventas para generar el preview");
            }

            byte[] pdfBytes = pdfReportService.generateSalesReport(sales);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(pdfBytes.length);
            // No agregar Content-Disposition para que se abra en el navegador

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Error generando preview: " + e.getMessage()).getBytes());
        }
    }

    @PostMapping("/report/pdf-preview")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<byte[]> generatePdfPreviewWithData(
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> salesData = (List<Map<String, Object>>) requestBody.get("sales");

            if (salesData == null || salesData.isEmpty()) {
                throw new RuntimeException("No se proporcionaron datos de ventas");
            }

            List<Sale> sales = convertToSaleObjects(salesData);
            byte[] pdfBytes = pdfReportService.generateSalesReport(sales);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Error generando preview: " + e.getMessage()).getBytes());
        }
    }

    // ============= MÉTODOS HELPER =============

    /**
     * Convierte los datos del frontend a objetos Sale
     */
    private List<Sale> convertToSaleObjects(List<Map<String, Object>> salesData) {
        List<Sale> sales = new ArrayList<>();

        for (Map<String, Object> saleData : salesData) {
            Sale sale = new Sale();

            // Mapear campos básicos
            if (saleData.get("id") != null) {
                sale.setId(Long.valueOf(saleData.get("id").toString()));
            }

            if (saleData.get("saleDate") != null) {
                // Convertir fecha desde string ISO
                String dateStr = saleData.get("saleDate").toString();
                sale.setSaleDate(LocalDateTime.parse(dateStr.substring(0, 19)));
            }

            if (saleData.get("totalAmount") != null) {
                sale.setTotalAmount(new BigDecimal(saleData.get("totalAmount").toString()));
            }

            if (saleData.get("paymentMethod") != null) {
                sale.setPaymentMethod(saleData.get("paymentMethod").toString());
            }

            if (saleData.get("active") != null) {
                sale.setActive(Boolean.parseBoolean(saleData.get("active").toString()));
            }

            if (saleData.get("createdAt") != null) {
                String dateStr = saleData.get("createdAt").toString();
                sale.setCreatedAt(LocalDateTime.parse(dateStr.substring(0, 19)));
            }

            // Mapear objetos anidados (user, game)
            if (saleData.get("user") != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> userData = (Map<String, Object>) saleData.get("user");
                User user = new User();
                if (userData.get("username") != null) {
                    user.setUsername(userData.get("username").toString());
                }
                if (userData.get("id") != null) {
                    user.setId(Long.valueOf(userData.get("id").toString()));
                }
                sale.setUser(user);
            }

            if (saleData.get("game") != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> gameData = (Map<String, Object>) saleData.get("game");
                Game game = new Game();
                if (gameData.get("name") != null) {
                    game.setTitle(gameData.get("name").toString());
                }
                if (gameData.get("id") != null) {
                    game.setId(Long.valueOf(gameData.get("id").toString()));
                }
                sale.setGame(game);
            }

            sales.add(sale);
        }

        return sales;
    }
}