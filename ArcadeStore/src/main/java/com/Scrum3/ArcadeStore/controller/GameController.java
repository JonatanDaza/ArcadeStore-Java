package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.dto.GameDTO;
// ✨ ¡Importante! Importa la INTERFAZ, no la implementación
import com.Scrum3.ArcadeStore.service.GameService; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowedHeaders = "*", allowCredentials = "true")
public class GameController {

    // ⚙️ Inyectamos la interfaz, no la clase concreta
    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // [LOS ENDPOINTS GET Y PATCH QUE YA TENÍAS FUNCIONARÁN AHORA SIN CAMBIOS]
    // ... getActiveGamesForStore, getFreeGames, getFeaturedGames, etc. ...

    @GetMapping("/public/active")
    public ResponseEntity<List<GameDTO>> getActiveGamesForStore() {
        List<GameDTO> gameDTOs = gameService.findActiveGamesDTO();
        return new ResponseEntity<>(gameDTOs, HttpStatus.OK);
    }
 
    @GetMapping("/public/free")
    public ResponseEntity<List<GameDTO>> getFreeGames() {
        List<GameDTO> freeGames = gameService.findFreeGamesDTO();
        return new ResponseEntity<>(freeGames, HttpStatus.OK);
    }
 
    @GetMapping("/public/featured")
    public ResponseEntity<List<GameDTO>> getFeaturedGames() {
        List<GameDTO> featuredGames = gameService.findFeaturedGamesDTO();
        return new ResponseEntity<>(featuredGames, HttpStatus.OK);
    }
 
    @GetMapping("/public/paid")
    public ResponseEntity<List<GameDTO>> getPaidGames() {
        List<GameDTO> paidGames = gameService.findPaidGamesDTO();
        return new ResponseEntity<>(paidGames, HttpStatus.OK);
    }

    @GetMapping("/public/recent")
    public ResponseEntity<List<GameDTO>> getRecentGames() {
        List<GameDTO> recentGames = gameService.findRecentGamesDTO();
        return new ResponseEntity<>(recentGames, HttpStatus.OK);
    }

    @PatchMapping("/{id}/highlight")
    public ResponseEntity<?> highlightGame(@PathVariable Long id, @RequestParam boolean highlighted) {
        try {
            // La firma ahora coincide perfectamente
            gameService.highlightGame(id, highlighted);
            return new ResponseEntity<>("Estado de destacado del juego actualizado.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar juego: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
 
    @GetMapping("/public/{id}")
    public ResponseEntity<GameDTO> getPublicGameById(@PathVariable Long id) {
        GameDTO game = gameService.findGameDTOById(id);
        if (game != null && game.isActive()) {
            return new ResponseEntity<>(game, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
 
    @GetMapping("/all")
    public ResponseEntity<List<GameDTO>> getAllGames() {
        List<GameDTO> games = gameService.findAllGamesDTO();
        return new ResponseEntity<>(games, HttpStatus.OK);
    }
 
    @GetMapping("/{id}/show")
    public ResponseEntity<GameDTO> getGameById(@PathVariable Long id) {
        GameDTO game = gameService.findGameDTOById(id);
        if (game != null) {
            return new ResponseEntity<>(game, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createGame(
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart("titulo") String titulo,
            @RequestPart("descripcion") String descripcion,
            @RequestPart("precio") String precioStr,
            @RequestPart("requisitos_minimos") String requisitosMinimos,
            @RequestPart("requisitos_recomendados") String requisitosRecomendados,
            @RequestPart("categoryId") String categoryIdStr,
            @RequestPart(value = "agreementId", required = false) String agreementIdStr,
            @RequestPart("active") String activeStr
    ) {
        try {
            // Conversión de tipos aquí en el controlador
            BigDecimal precio = new BigDecimal(precioStr);
            Long categoryId = Long.parseLong(categoryIdStr);
            boolean active = Boolean.parseBoolean(activeStr);
            Long agreementId = (agreementIdStr != null && !agreementIdStr.trim().isEmpty() && !agreementIdStr.equals("null")) ? Long.parseLong(agreementIdStr) : null;

            GameDTO createdGame = gameService.createGame(
                    titulo, descripcion, precio, requisitosMinimos, requisitosRecomendados, 
                    categoryId, agreementId, active, image
            );
            return new ResponseEntity<>(createdGame, HttpStatus.CREATED);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Error en formato de número: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());
        }
    }

    // Corregimos la llamada al método update
    @PutMapping(value = "/{id}/update", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateGame(
            @PathVariable Long id,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "titulo", required = false) String titulo,
            @RequestPart(value = "descripcion", required = false) String descripcion,
            @RequestPart(value = "precio", required = false) String precioStr,
            @RequestPart(value = "requisitos_minimos", required = false) String requisitosMinimos,
            @RequestPart(value = "requisitos_recomendados", required = false) String requisitosRecomendados,
            @RequestPart(value = "categoryId", required = false) String categoryIdStr,
            @RequestPart(value = "agreementId", required = false) String agreementIdStr,
            @RequestPart(value = "active", required = false) String activeStr
    ) {
        try {
            // Conversión de tipos para los campos que pueden venir
            BigDecimal precio = (precioStr != null) ? new BigDecimal(precioStr) : null;
            Long categoryId = (categoryIdStr != null) ? Long.parseLong(categoryIdStr) : null;
            Boolean active = (activeStr != null) ? Boolean.parseBoolean(activeStr) : null;
            Long agreementId = (agreementIdStr != null && !agreementIdStr.trim().isEmpty() && !agreementIdStr.equals("null")) ? Long.parseLong(agreementIdStr) : null;
             
             // Lógica para remover convenio si se envía vacío o "0"
            if (agreementIdStr != null && (agreementIdStr.trim().isEmpty() || agreementIdStr.equals("0"))) {
                agreementId = 0L; // Señal para remover
            }

            GameDTO updatedGame = gameService.updateGame(
                id, titulo, descripcion, precio, requisitosMinimos, requisitosRecomendados,
                categoryId, agreementId, active, image
            );

            return new ResponseEntity<>(updatedGame, HttpStatus.OK);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Error en formato de número: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> changeGameStatus(@PathVariable Long id, @RequestParam boolean active) {
        try {
            // Esta llamada ahora coincide con la interfaz
            gameService.changeGameStatus(id, active);
            return ResponseEntity.ok().body("Estado del juego actualizado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cambiar estado: " + e.getMessage());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("GameController is up and running!", HttpStatus.OK);
    }
}