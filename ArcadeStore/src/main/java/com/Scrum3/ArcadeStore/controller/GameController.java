package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.Repository.GameRepository;
import com.Scrum3.ArcadeStore.dto.GameDTO;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(
        origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowedHeaders = {"Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"},
        allowCredentials = "true",
        maxAge = 3600
)
public class GameController {

    @Autowired
    private GameService gameService;
    
    @Autowired
    private GameRepository gameRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Game>> getAllGames() {
        try {
            List<Game> games = gameService.getAllGames();
            return new ResponseEntity<>(games, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/dto")
    public ResponseEntity<List<GameDTO>> getGamesDto() {
        try {
            List<GameDTO> games = gameRepository.findAll().stream()
                    .map(GameDTO::new)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(games, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/show")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        try {
            return gameService.getGameById(id)
                    .map(game -> new ResponseEntity<>(game, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createGame(
            @RequestPart(value = "imagen", required = false) MultipartFile imagen,
            @RequestPart("titulo") String titulo,
            @RequestPart("descripcion") String descripcion,
            @RequestPart("precio") String precio,
            @RequestPart("requisitos_minimos") String requisitosMinimos,
            @RequestPart("requisitos_recomendados") String requisitosRecomendados,
            @RequestPart("categoryId") String categoryId,
            @RequestPart("active") String active
    ) {
        try {
            // Validar y convertir parámetros
            Double precioDouble;
            Long categoryIdLong;
            Boolean activeBoolean;
            
            try {
                precioDouble = Double.parseDouble(precio);
                categoryIdLong = Long.parseLong(categoryId);
                activeBoolean = Boolean.parseBoolean(active);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest()
                    .body("Error en formato de datos: " + e.getMessage());
            }

            // Validar imagen si se proporciona
            if (imagen != null && !imagen.isEmpty()) {
                String contentType = imagen.getContentType();
                if (contentType == null || 
                    (!contentType.startsWith("image/jpeg") && 
                     !contentType.startsWith("image/png") && 
                     !contentType.startsWith("image/gif"))) {
                    return ResponseEntity.badRequest()
                        .body("Tipo de archivo no soportado. Solo se permiten JPG, PNG y GIF.");
                }
                
                // Validar tamaño (máximo 5MB)
                if (imagen.getSize() > 5 * 1024 * 1024) {
                    return ResponseEntity.badRequest()
                        .body("El archivo es demasiado grande. Máximo 5MB.");
                }
            }

            Game createdGame = gameService.createGame(
                    imagen, titulo, descripcion, precioDouble,
                    requisitosMinimos, requisitosRecomendados, categoryIdLong, activeBoolean
            );
            
            return new ResponseEntity<>(createdGame, HttpStatus.CREATED);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}/update", consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<?> updateGame(
            @PathVariable Long id,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen,
            @RequestPart(value = "titulo", required = false) String titulo,
            @RequestPart(value = "descripcion", required = false) String descripcion,
            @RequestPart(value = "precio", required = false) String precio,
            @RequestPart(value = "requisitos_minimos", required = false) String requisitosMinimos,
            @RequestPart(value = "requisitos_recomendados", required = false) String requisitosRecomendados,
            @RequestPart(value = "categoryId", required = false) String categoryId,
            @RequestPart(value = "active", required = false) String active
    ) {
        try {
            Game updatedGame = gameService.updateGameWithMultipart(
                id, imagen, titulo, descripcion, precio, 
                requisitosMinimos, requisitosRecomendados, categoryId, active
            );
            
            if (updatedGame != null) {
                return new ResponseEntity<>(updatedGame, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> changeGameStatus(@PathVariable Long id, @RequestParam boolean active) {
        try {
            if (!active) {
                boolean desactivado = gameService.desactivarJuegoSINoTieneCategoriaActiva(id);
                if (desactivado) {
                    return ResponseEntity.ok().body("Juego desactivado exitosamente");
                } else {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("No se puede desactivar el juego porque tiene una categoría activa.");
                }
            } else {
                gameService.activarJuego(id);
                return ResponseEntity.ok().body("Juego activado exitosamente");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al cambiar estado: " + e.getMessage());
        }
    }

    // Endpoint para verificar conexión
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("API funcionando correctamente");
    }
}