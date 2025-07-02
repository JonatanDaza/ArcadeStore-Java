package com.Scrum3.ArcadeStore.service;

import com.Scrum3.ArcadeStore.dto.GameDTO;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface GameService {

    // Métodos para la tienda pública (devuelven DTOs)
    List<GameDTO> findActiveGamesDTO();
    List<GameDTO> findFreeGamesDTO();
    List<GameDTO> findFeaturedGamesDTO();
    List<GameDTO> findPaidGamesDTO();
    List<GameDTO> findRecentGamesDTO();
    GameDTO findGameDTOById(Long id);

    // Métodos para la administración (devuelven DTOs)
    List<GameDTO> findAllGamesDTO();
    GameDTO createGame(
            String titulo,
            String descripcion,
            BigDecimal precio,
            String requisitosMinimos,
            String requisitosRecomendados,
            Long categoryId,
            Long agreementId,
            Boolean active,
            MultipartFile image
    );

    GameDTO updateGame(
            Long id,
            String titulo,
            String descripcion,
            BigDecimal precio,
            String requisitosMinimos,
            String requisitosRecomendados,
            Long categoryId,
            Long agreementId,
            Boolean active,
            MultipartFile image
    );

    // Métodos para acciones específicas
    void changeGameStatus(Long id, boolean active);
    void highlightGame(Long id, boolean highlighted);
}