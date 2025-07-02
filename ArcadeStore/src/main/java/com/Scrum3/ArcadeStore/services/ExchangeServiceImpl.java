package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.dto.ExchangeRequest;
import com.Scrum3.ArcadeStore.dto.ExchangeResponse;
import com.Scrum3.ArcadeStore.service.ExchangeService;
import com.Scrum3.ArcadeStore.entities.Exchange;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.entities.Sale;
import com.Scrum3.ArcadeStore.Repository.ExchangeRepository;
import com.Scrum3.ArcadeStore.Repository.GameRepository;
import com.Scrum3.ArcadeStore.Repository.UserRepository;
import com.Scrum3.ArcadeStore.Repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

    @Autowired
    private SaleRepository saleRepository;

    @Override
    @Transactional
    public ExchangeResponse createExchange(ExchangeRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar que los juegos existen
        Game offeredGame = gameRepository.findById(request.getOfferedGameId())
                .orElseThrow(() -> new RuntimeException("Juego ofrecido no encontrado"));

        Game requestedGame = gameRepository.findById(request.getRequestedGameId())
                .orElseThrow(() -> new RuntimeException("Juego solicitado no encontrado"));

        // Validar que el usuario posee el juego ofrecido (verificar en Sales)
        boolean userOwnsOfferedGame = saleRepository.existsByUserAndGameAndActiveTrue(requester, offeredGame);
        if (!userOwnsOfferedGame) {
            throw new RuntimeException("No posees el juego que intentas intercambiar");
        }

        // Validar que el juego solicitado está disponible en la tienda
        if (!requestedGame.isActive()) {
            throw new RuntimeException("El juego solicitado no está disponible");
        }

        // Calcular el costo del intercambio
        ExchangeCost exchangeCost = calculateExchangeCost(offeredGame, requestedGame);

        // Crear el intercambio
        Exchange exchange = new Exchange();
        exchange.setRequester(requester);
        exchange.setOwner(null); // Es intercambio con la tienda
        exchange.setOfferedGame(offeredGame);
        exchange.setRequestedGame(requestedGame);
        exchange.setStatus("PENDING");
        exchange.setExchangeDate(LocalDateTime.now());

        // Si hay costo adicional, validar que el usuario tenga suficiente saldo
        // (Aquí podrías implementar un sistema de saldo si lo tienes)
        if (exchangeCost.getAdditionalCost().compareTo(BigDecimal.ZERO) > 0) {
            // Por ahora, asumimos que el pago se manejará externamente
            // El intercambio se marca como PENDING hasta que se complete el pago
        }

        // Procesar el intercambio
        processExchange(exchange, exchangeCost);

        Exchange savedExchange = exchangeRepository.save(exchange);
        return convertToResponse(savedExchange, exchangeCost);
    }

    private ExchangeCost calculateExchangeCost(Game offeredGame, Game requestedGame) {
        BigDecimal offeredPrice = offeredGame.getPrice();
        BigDecimal requestedPrice = requestedGame.getPrice();
        
        // Calcular la diferencia de precios
        BigDecimal priceDifference = requestedPrice.subtract(offeredPrice);
        
        // Calcular el 10% del precio del juego ofrecido
        BigDecimal tenPercentOfOffered = offeredPrice.multiply(new BigDecimal("0.10"));
        
        ExchangeCost cost = new ExchangeCost();
        cost.setOfferedGamePrice(offeredPrice);
        cost.setRequestedGamePrice(requestedPrice);
        cost.setPriceDifference(priceDifference);
        
        // Si el precio del juego solicitado es menor un 10% o más del precio del juego ofrecido
        // (es decir, la diferencia es menor o igual al 10% del juego ofrecido), el intercambio es gratis
        if (priceDifference.compareTo(tenPercentOfOffered) <= 0) {
            cost.setAdditionalCost(BigDecimal.ZERO);
            cost.setIsFree(true);
            cost.setReason("El precio del juego solicitado está dentro del 10% del precio del juego ofrecido");
        } else {
            // Si no, el costo adicional es el 10% del juego ofrecido
            cost.setAdditionalCost(tenPercentOfOffered);
            cost.setIsFree(false);
            cost.setReason("Costo adicional del 10% del juego ofrecido");
        }
        
        return cost;
    }

    @Transactional
    private void processExchange(Exchange exchange, ExchangeCost cost) {
        User requester = exchange.getRequester();
        Game offeredGame = exchange.getOfferedGame();
        Game requestedGame = exchange.getRequestedGame();

        // 1. Desactivar la venta del juego ofrecido (marcar como inactiva en lugar de eliminar)
        Sale userOfferedGameSale = saleRepository.findByUserAndGameAndActiveTrue(requester, offeredGame)
                .orElseThrow(() -> new RuntimeException("Error al procesar intercambio: venta del juego ofrecido no encontrada"));
        userOfferedGameSale.setActive(false);
        saleRepository.save(userOfferedGameSale);

        // 2. Liberar el juego ofrecido, quitando al dueño para que vuelva a la tienda.
        offeredGame.setUser(null);
        gameRepository.save(offeredGame);

        // 3. Crear una nueva venta para el juego solicitado
        Sale newSale = new Sale();
        newSale.setUser(requester);
        newSale.setGame(requestedGame);
        newSale.setSaleDate(LocalDateTime.now());
        newSale.setUnitPrice(requestedGame.getPrice());
        newSale.setQuantity(1);
        newSale.setActive(true);
        // No se asigna 'order' porque es un intercambio, no una compra directa.
        saleRepository.save(newSale);

        // 4. Asignar el nuevo juego al usuario.
        requestedGame.setUser(requester);
        gameRepository.save(requestedGame);

        // 5. Actualizar el estado del intercambio a completado
        exchange.setStatus("COMPLETED");
    }

    @Override
    public List<ExchangeResponse> getAllExchanges() {
        return exchangeRepository.findAll().stream()
                .map(exchange -> convertToResponse(exchange, null))
                .collect(Collectors.toList());
    }

    @Override
    public ExchangeResponse getExchangeById(Long id) {
        Exchange exchange = exchangeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intercambio no encontrado"));
        return convertToResponse(exchange, null);
    }

    @Override
    public List<ExchangeResponse> getUserExchanges(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return exchangeRepository.findByRequesterOrOwner(user, user).stream()
                .map(exchange -> convertToResponse(exchange, null))
                .collect(Collectors.toList());
    }

    private ExchangeResponse convertToResponse(Exchange exchange, ExchangeCost cost) {
        ExchangeResponse response = new ExchangeResponse();
        response.setId(exchange.getId());
        response.setRequesterId(exchange.getRequester().getId());
        response.setOwnerId(exchange.getOwner() != null ? exchange.getOwner().getId() : null);
        response.setOfferedGameId(exchange.getOfferedGame().getId());
        response.setOfferedGameTitle(exchange.getOfferedGame().getTitle());
        response.setRequestedGameId(exchange.getRequestedGame().getId());
        response.setRequestedGameTitle(exchange.getRequestedGame().getTitle());
        response.setStatus(exchange.getStatus());
        response.setExchangeDate(exchange.getExchangeDate());
        
        // Si tenemos información del costo, la agregamos
        if (cost != null) {
            response.setAdditionalCost(cost.getAdditionalCost());
            response.setCostReason(cost.getReason());
        }
        
        return response;
    }

    // Clase interna para manejar los cálculos de costo
    private static class ExchangeCost {
        private BigDecimal offeredGamePrice;
        private BigDecimal requestedGamePrice;
        private BigDecimal priceDifference;
        private BigDecimal additionalCost;
        private boolean isFree;
        private String reason;

        // Getters y setters
        public BigDecimal getOfferedGamePrice() { return offeredGamePrice; }
        public void setOfferedGamePrice(BigDecimal offeredGamePrice) { this.offeredGamePrice = offeredGamePrice; }

        public BigDecimal getRequestedGamePrice() { return requestedGamePrice; }
        public void setRequestedGamePrice(BigDecimal requestedGamePrice) { this.requestedGamePrice = requestedGamePrice; }

        public BigDecimal getPriceDifference() { return priceDifference; }
        public void setPriceDifference(BigDecimal priceDifference) { this.priceDifference = priceDifference; }

        public BigDecimal getAdditionalCost() { return additionalCost; }
        public void setAdditionalCost(BigDecimal additionalCost) { this.additionalCost = additionalCost; }

        public boolean getIsFree() { return isFree; }
        public void setIsFree(boolean isFree) { this.isFree = isFree; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}