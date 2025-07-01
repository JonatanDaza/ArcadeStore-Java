package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.dto.ExchangeRequest;
import com.Scrum3.ArcadeStore.dto.ExchangeResponse;
import com.Scrum3.ArcadeStore.service.ExchangeService;
import com.Scrum3.ArcadeStore.entities.Exchange;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.Repository.ExchangeRepository;
import com.Scrum3.ArcadeStore.Repository.GameRepository;
import com.Scrum3.ArcadeStore.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExchangeServiceImpl implements ExchangeService {

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    @Override
    public ExchangeResponse createExchange(ExchangeRequest request, Authentication authentication) {
        // 1. Obtener el usuario autenticado (el que solicita el intercambio)
        String userEmail = authentication.getName();
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Obtener los juegos involucrados
        Game offeredGame = gameRepository.findById(request.getOfferedGameId())
                .orElseThrow(() -> new RuntimeException("Juego ofrecido no encontrado"));
        Game requestedGame = gameRepository.findById(request.getRequestedGameId())
                .orElseThrow(() -> new RuntimeException("Juego solicitado no encontrado"));

        // 3. Obtener el propietario del juego solicitado
        User owner = requestedGame.getUser();
        
        // ✅ CAMBIO: El 'owner' puede ser nulo si el juego es de la tienda.
        // Solo validamos que el solicitante no sea el dueño si el dueño existe.
        if (owner != null && requester.getId().equals(owner.getId())) {
            throw new RuntimeException("No puedes intercambiar un juego contigo mismo.");
        }

        // 4. Crear y guardar el nuevo registro de intercambio
        Exchange newExchange = new Exchange();
        newExchange.setRequester(requester);
        newExchange.setOwner(owner);
        newExchange.setOfferedGame(offeredGame);
        newExchange.setRequestedGame(requestedGame);
        newExchange.setStatus("PENDING"); // Estado inicial
        newExchange.setExchangeDate(LocalDateTime.now());

        Exchange savedExchange = exchangeRepository.save(newExchange);

        return convertToDto(savedExchange);
    }

    @Override
    public List<ExchangeResponse> getAllExchanges() {
        return exchangeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExchangeResponse getExchangeById(Long id) {
        Exchange exchange = exchangeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intercambio no encontrado"));
        return convertToDto(exchange);
    }

    private ExchangeResponse convertToDto(Exchange exchange) {
        ExchangeResponse dto = new ExchangeResponse();
        dto.setId(exchange.getId());
        dto.setRequesterId(exchange.getRequester().getId());
        dto.setOwnerId(exchange.getOwner().getId());
        dto.setOfferedGameId(exchange.getOfferedGame().getId());
        dto.setRequestedGameId(exchange.getRequestedGame().getId());
        dto.setStatus(exchange.getStatus());
        dto.setExchangeDate(exchange.getExchangeDate());
        return dto;
    }
}
