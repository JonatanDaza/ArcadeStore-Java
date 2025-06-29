package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.AgreementRepository;
import com.Scrum3.ArcadeStore.Repository.CategoryRepository;
import com.Scrum3.ArcadeStore.entities.Agreement;
import com.Scrum3.ArcadeStore.entities.Category;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.Repository.GameRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GameService {

    private final CategoryRepository categoryRepository;
    private final GameRepository gameRepository;
    private final AgreementRepository agreementRepository;

    // Directorio donde se guardarán las imágenes
    private final String uploadDir = "uploads/games/";

    public GameService(CategoryRepository categoryRepository, GameRepository gameRepository, AgreementRepository agreementRepository) {
        this.categoryRepository = categoryRepository;
        this.gameRepository = gameRepository;
        this.agreementRepository = agreementRepository;
        
        // Crear directorio si no existe
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de uploads", e);
        }
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
        try {
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

            // Guardar imagen si se proporciona
            if (imagen != null && !imagen.isEmpty()) {
                String imagePath = saveImage(imagen);
                game.setImagePath(imagePath);
            }

            return gameRepository.save(game);
        } catch (Exception e) {
            throw new RuntimeException("Error al crear el juego: " + e.getMessage(), e);
        }
    }

    private String saveImage(MultipartFile imagen) {
        try {
            // Generar nombre único para el archivo
            String originalFilename = imagen.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path uploadPath = Paths.get(uploadDir);
            
            // Crear directorio si no existe
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            
            // Copiar archivo
            Files.copy(imagen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            return fileName; // Solo devolver el nombre del archivo, no la ruta completa
            
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen: " + e.getMessage(), e);
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

    public Game updateGameWithMultipart(
            Long id,
            MultipartFile imagen,
            String titulo,
            String descripcion,
            String precio,
            String requisitosMinimos,
            String requisitosRecomendados,
            String categoryId,
            String active
    ) {
        try {
            Optional<Game> optionalGame = gameRepository.findById(id);
            if (!optionalGame.isPresent()) {
                return null;
            }

            Game existingGame = optionalGame.get();

            // Actualizar campos si se proporcionan
            if (titulo != null) existingGame.setTitle(titulo);
            if (descripcion != null) existingGame.setDescription(descripcion);
            if (precio != null) existingGame.setPrice(Double.parseDouble(precio));
            if (requisitosMinimos != null) existingGame.setRequisiteMinimum(requisitosMinimos);
            if (requisitosRecomendados != null) existingGame.setRequisiteRecommended(requisitosRecomendados);
            if (active != null) existingGame.setActive(Boolean.parseBoolean(active));

            // Actualizar categoría si se proporciona
            if (categoryId != null) {
                Category category = getCategoryById(Long.parseLong(categoryId));
                existingGame.setCategory(category);
            }

            // Actualizar imagen si se proporciona
            if (imagen != null && !imagen.isEmpty()) {
                String imagePath = saveImage(imagen);
                existingGame.setImagePath(imagePath);
            }

            return gameRepository.save(existingGame);
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar el juego: " + e.getMessage(), e);
        }
    }

    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoryId));
    }

    public boolean desactivarJuegoSINoTieneCategoriaActiva(Long id) {
        try {
            Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado con ID: " + id));
            
            boolean tieneJuegosActivos = gameRepository.existsByCategoryIdAndActiveTrue(game.getCategory().getId());
            if (!tieneJuegosActivos) {
                game.setActive(false);
                gameRepository.save(game);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Error al desactivar juego: " + e.getMessage(), e);
        }
    }

    public void activarJuego(Long id) {
        try {
            Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado con ID: " + id));
            game.setActive(true);
            gameRepository.save(game);
        } catch (Exception e) {
            throw new RuntimeException("Error al activar juego: " + e.getMessage(), e);
        }
    }
}