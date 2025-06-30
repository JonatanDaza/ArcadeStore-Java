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

    // Endpoint de diagnóstico temporal
    @GetMapping("/public/debug")
    public ResponseEntity<?> debugGames() {
        try {
            System.out.println("🔍 DEBUG: Iniciando diagnóstico...");
            
            // Verificar repositorio
            if (gameRepository == null) {
                System.err.println("❌ DEBUG: GameRepository es null!");
                return ResponseEntity.ok("ERROR: GameRepository es null");
            }
            
            // Contar todos los juegos
            long totalGames = gameRepository.count();
            System.out.println("🔍 DEBUG: Total de juegos en BD: " + totalGames);
            
            // Obtener todos los juegos
            List<Game> allGames = gameRepository.findAll();
            System.out.println("🔍 DEBUG: Juegos obtenidos: " + allGames.size());
            
            // Verificar juegos activos
            List<Game> activeGames = gameRepository.findByActiveTrue();
            System.out.println("🔍 DEBUG: Juegos activos: " + (activeGames != null ? activeGames.size() : "null"));
            
            // Información detallada
            StringBuilder info = new StringBuilder();
            info.append("Total juegos: ").append(totalGames).append("\n");
            info.append("Juegos obtenidos: ").append(allGames.size()).append("\n");
            info.append("Juegos activos: ").append(activeGames != null ? activeGames.size() : "null").append("\n");
            
            if (allGames.size() > 0) {
                info.append("\nPrimer juego:\n");
                Game firstGame = allGames.get(0);
                info.append("- ID: ").append(firstGame.getId()).append("\n");
                info.append("- Título: ").append(firstGame.getTitle()).append("\n");
                info.append("- Activo: ").append(firstGame.isActive()).append("\n");
                info.append("- Categoría: ").append(firstGame.getCategory() != null ? firstGame.getCategory().getName() : "null").append("\n");
                info.append("- Convenio: ").append(firstGame.getAgreement() != null ? firstGame.getAgreement().getCompanyName() : "null").append("\n");
            }
            
            return ResponseEntity.ok(info.toString());
            
        } catch (Exception e) {
            System.err.println("❌ DEBUG: Error en diagnóstico: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok("ERROR: " + e.getMessage() + "\nStack: " + e.getStackTrace()[0]);
        }
    }

    // Endpoint para verificar conexión
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        System.out.println("💚 Health check solicitado");
        return ResponseEntity.ok("API funcionando correctamente");
    }

    // ENDPOINTS PÚBLICOS PARA LA TIENDA (ORDEN IMPORTANTE - ESPECÍFICOS PRIMERO)
    
    @GetMapping("/public/active")
    public ResponseEntity<List<GameDTO>> getActiveGamesForStore() {
        try {
            System.out.println("🎮 Iniciando getActiveGamesForStore...");
            
            // Verificar que el repositorio esté disponible
            if (gameRepository == null) {
                System.err.println("❌ GameRepository es null!");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
            System.out.println("📦 Buscando juegos activos...");
            List<Game> activeGames = gameRepository.findByActiveTrue();
            System.out.println("📦 Juegos activos encontrados: " + (activeGames != null ? activeGames.size() : "null"));
            
            if (activeGames == null) {
                System.err.println("❌ La consulta devolvió null");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
            System.out.println("🔄 Convirtiendo a DTO...");
            List<GameDTO> gameDTOs = activeGames.stream()
                    .map(game -> {
                        System.out.println("🎯 Procesando juego: " + game.getTitle());
                        return new GameDTO(game);
                    })
                    .collect(Collectors.toList());
            
            System.out.println("✅ DTOs creados: " + gameDTOs.size());
            return new ResponseEntity<>(gameDTOs, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("❌ Error in getActiveGamesForStore: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/public/paid")
    public ResponseEntity<List<GameDTO>> getPaidGames() {
        try {
            System.out.println("💰 Buscando juegos de pago...");
            
            List<GameDTO> paidGames = gameRepository.findByActiveTrueAndPriceGreaterThan(0.0).stream()
                    .map(GameDTO::new)
                    .collect(Collectors.toList());
            
            System.out.println("💰 Juegos de pago encontrados: " + paidGames.size());
            return new ResponseEntity<>(paidGames, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error in getPaidGames: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/public/free")
    public ResponseEntity<List<GameDTO>> getFreeGames() {
        try {
            System.out.println("🆓 Buscando juegos gratuitos...");
            
            List<GameDTO> freeGames = gameRepository.findByActiveTrueAndPrice(0.0).stream()
                    .map(GameDTO::new)
                    .collect(Collectors.toList());
            
            System.out.println("🆓 Juegos gratuitos encontrados: " + freeGames.size());
            return new ResponseEntity<>(freeGames, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error in getFreeGames: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/public/featured")
    public ResponseEntity<List<GameDTO>> getFeaturedGames() {
        try {
            System.out.println("🌟 Buscando juegos destacados...");
            
            List<GameDTO> featuredGames = gameRepository.findByActiveTrueAndHighlightedTrue().stream()
                    .map(GameDTO::new)
                    .collect(Collectors.toList());
            
            System.out.println("🌟 Juegos destacados encontrados: " + featuredGames.size());
            return new ResponseEntity<>(featuredGames, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error in getFeaturedGames: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/public/recent")
    public ResponseEntity<List<GameDTO>> getRecentGames() {
        try {
            System.out.println("🕒 Buscando juegos recientes...");
            
            List<GameDTO> recentGames = gameRepository.findTop6ByActiveTrueOrderByIdDesc().stream()
                    .map(GameDTO::new)
                    .collect(Collectors.toList());
            
            System.out.println("🕒 Juegos recientes encontrados: " + recentGames.size());
            return new ResponseEntity<>(recentGames, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error in getRecentGames: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/public/category/{categoryId}")
    public ResponseEntity<List<GameDTO>> getGamesByCategory(@PathVariable Long categoryId) {
        try {
            System.out.println("📂 Buscando juegos por categoría: " + categoryId);
            
            List<GameDTO> categoryGames = gameRepository.findByActiveTrueAndCategoryId(categoryId).stream()
                    .map(GameDTO::new)
                    .collect(Collectors.toList());
            
            System.out.println("📂 Juegos encontrados en categoría " + categoryId + ": " + categoryGames.size());
            return new ResponseEntity<>(categoryGames, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error in getGamesByCategory: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // IMPORTANTE: Este endpoint debe ir AL FINAL porque usa {id} como variable
    @GetMapping("/public/{id}")
    public ResponseEntity<GameDTO> getPublicGameById(@PathVariable Long id) {
        try {
            System.out.println("🎮 Buscando juego público con ID: " + id);
            
            return gameService.getGameById(id)
                    .filter(game -> {
                        System.out.println("🔍 Juego encontrado: " + game.getTitle() + ", activo: " + game.isActive());
                        return game.isActive(); // Solo juegos activos
                    })
                    .map(game -> {
                        System.out.println("✅ Devolviendo juego: " + game.getTitle());
                        return new ResponseEntity<>(new GameDTO(game), HttpStatus.OK);
                    })
                    .orElseGet(() -> {
                        System.out.println("❌ Juego no encontrado o inactivo");
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    });
        } catch (Exception e) {
            System.err.println("❌ Error in getPublicGameById: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoints protegidos para administración
    @GetMapping("/all")
    public ResponseEntity<List<Game>> getAllGames() {
        try {
            List<Game> games = gameService.getAllGames();
            return new ResponseEntity<>(games, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Detailed Error in getAllGames: " + e.getMessage());
            e.printStackTrace();
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
            @RequestPart(value = "agreementId", required = false) String agreementId, // NUEVO: Campo opcional para convenio
            @RequestPart("active") String active
    ) {
        try {
            // Validar y convertir parámetros
            Double precioDouble;
            Long categoryIdLong;
            Long agreementIdLong = null; // NUEVO: Convenio opcional
            Boolean activeBoolean;
            
            try {
                precioDouble = Double.parseDouble(precio);
                categoryIdLong = Long.parseLong(categoryId);
                activeBoolean = Boolean.parseBoolean(active);
                
                // NUEVO: Parsear agreementId si se proporciona
                if (agreementId != null && !agreementId.trim().isEmpty() && !agreementId.equals("null")) {
                    agreementIdLong = Long.parseLong(agreementId);
                }
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
                    requisitosMinimos, requisitosRecomendados, categoryIdLong, agreementIdLong, activeBoolean // NUEVO: Pasar agreementId
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
            @RequestPart(value = "agreementId", required = false) String agreementId, // NUEVO: Campo opcional para convenio
            @RequestPart(value = "active", required = false) String active
    ) {
        try {
            Game updatedGame = gameService.updateGameWithMultipart(
                id, imagen, titulo, descripcion, precio, 
                requisitosMinimos, requisitosRecomendados, categoryId, agreementId, active // NUEVO: Pasar agreementId
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
}
