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
)public class GameController {

    @Autowired
    private GameService gameService;
    private GameRepository gameRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Game>> getAllGames() {
        List<Game> games = gameService.getAllGames();
        return new ResponseEntity<>(games, HttpStatus.OK);
    }

    @GetMapping("/api/games/dto")
    public List<GameDTO> Gamesobtain() {
        return gameRepository.findAll().stream()
                .map(GameDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}/show")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        return gameService.getGameById(id)
                .map(game -> new ResponseEntity<>(game, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<Game> createGame(
            @RequestPart(value = "imagen", required = false) MultipartFile imagen,
            @RequestPart("titulo") String titulo,
            @RequestPart("descripcion") String descripcion,
            @RequestPart("precio") Double precio,
            @RequestPart("requisitos_minimos") String requisitosMinimos,
            @RequestPart("requisitos_recomendados") String requisitosRecomendados,
            @RequestPart("categoryId") Long categoryId,
            @RequestPart("active") Boolean active
    ) {
        Game createdGame = gameService.createGame(
                imagen, titulo, descripcion, precio,
                requisitosMinimos, requisitosRecomendados, categoryId, active
        );
        return new ResponseEntity<>(createdGame, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<Game> updateGame(@PathVariable Long id, @RequestBody Game gameDetails) {
        Game updatedGame = gameService.updateGame(id, gameDetails);
        if (updatedGame != null) {
            return new ResponseEntity<>(updatedGame, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<String> changeGameStatus(@PathVariable Long id, @RequestParam boolean active) {
        if (!active) {
            boolean desactivado = gameService.desactivarJuegoSINoTieneCategoriaActiva(id);
            if (desactivado) {
                return ResponseEntity.noContent().build(); // 204 No Content
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("No se puede desactivar el juego porque tiene una categoría activa.");
            }
        } else {
            gameService.activarJuego(id);
            return ResponseEntity.noContent().build();
        }
    }
}