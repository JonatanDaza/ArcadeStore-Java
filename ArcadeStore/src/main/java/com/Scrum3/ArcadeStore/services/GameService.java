package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.AgreementRepository;
import com.Scrum3.ArcadeStore.Repository.CategoryRepository;
import com.Scrum3.ArcadeStore.entities.Agreement;
import com.Scrum3.ArcadeStore.entities.Category;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.Repository.GameRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    private final CategoryRepository categoryRepository;
    private final GameRepository gameRepository;
    private final AgreementRepository agreementRepository;

    public GameService(CategoryRepository categoryRepository, GameRepository gameRepository, AgreementRepository agreementRepository) {
        this.categoryRepository = categoryRepository;
        this.gameRepository = gameRepository;
        this.agreementRepository = agreementRepository;
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Optional<Game> getGameById(Long id) {
        return gameRepository.findById(id);
    }

    public Game createGame(
            MultipartFile imagen,
            String titulo,
            String descripcion,
            Double precio,
            String requisitosMinimos,
            String requisitosRecomendados,
            Long categoryId,
            Boolean active
    ) {
        Game game = new Game();
        game.setTitle(titulo);
        game.setDescription(descripcion);
        game.setPrice(precio);
        game.setRequisiteMinimum(requisitosMinimos);
        game.setRequisiteRecommended(requisitosRecomendados);
        game.setActive(active != null ? active : true);

        // Buscar y asignar categoría
        Category category = getCategoryById(categoryId);
        game.setCategory(category);

        // Guardar imagen y asignar ruta
        if (imagen != null && !imagen.isEmpty()) {
            String imagePath = saveImage(imagen); // Implementa este método para guardar la imagen
            game.setImagePath(imagePath);
        }

        return gameRepository.save(game);
    }

    // Ejemplo simple de guardado de imagen (ajusta la ruta según tu proyecto)
    private String saveImage(MultipartFile imagen) {
        try {
            String fileName = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
            String uploadDir = "uploads/games/";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            java.nio.file.Path filePath = uploadPath.resolve(fileName);
            imagen.transferTo(filePath.toFile());
            return uploadDir + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar la imagen", e);
        }
    }

    public Game updateGame(Long id, Game gameDetails) {
        Optional<Game> optionalGame = gameRepository.findById(id);
        if (optionalGame.isPresent()) {
            Game existingGame = optionalGame.get();
            existingGame.setTitle(gameDetails.getTitle());
            existingGame.setDescription(gameDetails.getDescription());
            existingGame.setPrice(gameDetails.getPrice());
            existingGame.setCategory(gameDetails.getCategory());
            existingGame.setRequisiteMinimum(gameDetails.getRequisiteMinimum());
            existingGame.setRequisiteRecommended(gameDetails.getRequisiteRecommended());
            existingGame.setActive(gameDetails.isActive());
            if (gameDetails.getImagePath() != null) {
                existingGame.setImagePath(gameDetails.getImagePath());
            }
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
        boolean tieneJuegosActivos = gameRepository.existsByCategoryIdAndActiveTrue(game.getCategory().getId());
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