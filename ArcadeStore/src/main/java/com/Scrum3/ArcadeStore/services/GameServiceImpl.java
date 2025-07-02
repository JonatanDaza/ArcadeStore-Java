package com.Scrum3.ArcadeStore.service;

import com.Scrum3.ArcadeStore.Repository.AgreementRepository;
import com.Scrum3.ArcadeStore.Repository.CategoryRepository;
import com.Scrum3.ArcadeStore.Repository.GameRepository;
import com.Scrum3.ArcadeStore.dto.GameDTO;
import com.Scrum3.ArcadeStore.entities.Agreement;
import com.Scrum3.ArcadeStore.entities.Category;
import com.Scrum3.ArcadeStore.entities.Game;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {

    private final CategoryRepository categoryRepository;
    private final GameRepository gameRepository;
    private final AgreementRepository agreementRepository;
    private final String uploadDir = "uploads/games/";

    public GameServiceImpl(CategoryRepository categoryRepository, GameRepository gameRepository, AgreementRepository agreementRepository) {
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

    // --- MÉTODOS PÚBLICOS DE LA INTERFAZ ---

    @Override
    public List<GameDTO> findAllGamesDTO() {
        return gameRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<GameDTO> findActiveGamesDTO() {
        return gameRepository.findByActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<GameDTO> findFreeGamesDTO() {
        return gameRepository.findByActiveTrueAndPrice(BigDecimal.ZERO).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<GameDTO> findFeaturedGamesDTO() {
        return gameRepository.findByActiveTrueAndHighlightedTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<GameDTO> findPaidGamesDTO() {
        return gameRepository.findByActiveTrueAndPriceGreaterThan(BigDecimal.ZERO).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<GameDTO> findRecentGamesDTO() {
        return gameRepository.findTop6ByActiveTrueOrderByIdDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GameDTO findGameDTOById(Long id) {
        return gameRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Override
    public GameDTO createGame(String titulo, String descripcion, BigDecimal precio, String requisitosMinimos,
            String requisitosRecomendados, Long categoryId, Long agreementId, Boolean active, MultipartFile image) {
        
        Game game = new Game();
        game.setTitle(titulo);
        game.setDescription(descripcion);
        game.setPrice(precio);
        game.setRequisiteMinimum(requisitosMinimos);
        game.setRequisiteRecommended(requisitosRecomendados);
        game.setActive(active != null ? active : true);
        game.setHighlighted(false);

        Category category = getCategoryById(categoryId);
        game.setCategory(category);

        if (agreementId != null) {
            Agreement agreement = getAgreementById(agreementId);
            game.setAgreement(agreement);
        }

        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            game.setImagePath(imagePath);
        }

        Game savedGame = gameRepository.save(game);
        return convertToDTO(savedGame);
    }

    @Override
    public GameDTO updateGame(Long id, String titulo, String descripcion, BigDecimal precio, String requisitosMinimos,
            String requisitosRecomendados, Long categoryId, Long agreementId, Boolean active, MultipartFile image) {
        
        Game existingGame = gameRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Juego no encontrado con ID: " + id));

        if (titulo != null) existingGame.setTitle(titulo);
        if (descripcion != null) existingGame.setDescription(descripcion);
        if (precio != null) existingGame.setPrice(precio);
        if (requisitosMinimos != null) existingGame.setRequisiteMinimum(requisitosMinimos);
        if (requisitosRecomendados != null) existingGame.setRequisiteRecommended(requisitosRecomendados);
        if (active != null) existingGame.setActive(active);

        if (categoryId != null) {
            Category category = getCategoryById(categoryId);
            existingGame.setCategory(category);
        }

        if (agreementId != null) {
            if (agreementId == 0L) {
                existingGame.setAgreement(null);
            } else {
                Agreement agreement = getAgreementById(agreementId);
                existingGame.setAgreement(agreement);
            }
        }

        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            existingGame.setImagePath(imagePath);
        }

        Game updatedGame = gameRepository.save(existingGame);
        return convertToDTO(updatedGame);
    }

    @Override
    public void changeGameStatus(Long id, boolean active) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Juego no encontrado con ID: " + id));

        if (active) {
            if (game.getCategory() == null || !game.getCategory().isActive()) {
                throw new IllegalStateException("No se puede activar el juego porque su categoría no existe o está inactiva.");
            }
        }

        game.setActive(active);
        gameRepository.save(game);
    }

    @Override
    public void highlightGame(Long id, boolean highlighted) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Juego no encontrado con ID: " + id));
        game.setHighlighted(highlighted);
        gameRepository.save(game);
    }

    // --- MÉTODOS PRIVADOS AUXILIARES ---

    private String saveImage(MultipartFile imagen) {
        try {
            String originalFilename = imagen.getOriginalFilename();
            String fileExtension = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.copy(imagen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen: " + e.getMessage(), e);
        }
    }

    private Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + categoryId));
    }

    private Agreement getAgreementById(Long agreementId) {
        return agreementRepository.findById(agreementId)
                .orElseThrow(() -> new EntityNotFoundException("Convenio no encontrado con ID: " + agreementId));
    }

    private GameDTO convertToDTO(Game game) {
        return new GameDTO(game);
    }
}