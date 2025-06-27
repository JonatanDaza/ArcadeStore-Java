package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.Repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

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
            return gameRepository.save(existingGame);
        } else {
            return null;
        }
    }

    public boolean deleteGame(Long id) {
        if (gameRepository.existsById(id)) {
            gameRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}