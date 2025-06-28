package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.CategoryRepository;
import com.Scrum3.ArcadeStore.entities.Category;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.Repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    private final CategoryRepository categoryRepository;
    private final GameRepository gameRepository;

    public GameService(CategoryRepository categoryRepository, GameRepository gameRepository) {
        this.categoryRepository = categoryRepository;
        this.gameRepository = gameRepository;
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Optional<Game> getGameById(Long id) {
        return gameRepository.findById(id);
    }

    public Game createGame(Game game) {
        return gameRepository.save(game);
    }

    public Game updateGame(Long id, Game gameDetails) {
        Optional<Game> optionalGame = gameRepository.findById(id);
        if (optionalGame.isPresent()) {
            Game existingGame = optionalGame.get();
            existingGame.setName(gameDetails.getName());
            existingGame.setDescription(gameDetails.getDescription());
            existingGame.setCategory(gameDetails.getCategory());
            existingGame.setInventory(gameDetails.getInventory());
            existingGame.setRequisiteMinimum(gameDetails.getRequisiteMinimum());
            existingGame.setRequisiteRecommended(gameDetails.getRequisiteRecommended());
            return gameRepository.save(existingGame);
        } else {
            return null;
        }
    }

    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }
    public boolean desactivarJuegoSINoTieneCategoriaActiva(Long id) {
        Game game = gameRepository.findById(id).orElseThrow();
        boolean tieneJuegosActivos = GameRepository.existsByCategoryIdAndActiveTrue(game.getCategory().getId());
        if (!tieneJuegosActivos) {
            game.setActive(false);
            gameRepository.save(game);
            return true;
        }
        return false;
    }

    public void activarJuego(Long id) {
        Game game = gameRepository.findById(id).orElseThrow();
        game.setActive(true);
        gameRepository.save(game);
    }
}