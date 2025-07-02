package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.dto.ExchangeCost;
import com.Scrum3.ArcadeStore.dto.ExchangeDTO;
import com.Scrum3.ArcadeStore.dto.ExchangeRequest;
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
    public ExchangeDTO createExchange(ExchangeRequest request, Authentication authentication) {
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
        exchange.setAdditionalCost(exchangeCost.getAdditionalCost());

        // Si no hay costo adicional, procesar inmediatamente.
        // Si hay costo, se queda en PENDING hasta que se confirme el pago.
        // La confirmación del pago debería llamar a otro método para procesar el intercambio.
        if (exchangeCost.getAdditionalCost().compareTo(BigDecimal.ZERO) <= 0) {
            processExchange(exchange, exchangeCost);
        }

        Exchange savedExchange = exchangeRepository.save(exchange);
        return convertToDTO(savedExchange, exchangeCost);
    }

    /**
     * Calcula el costo de un intercambio basado en la diferencia de precios.
     * La regla es: se cobra una comisión del 10% del valor del juego OFRECIDO,
     * a menos que el juego SOLICITADO sea más barato que el juego OFRECIDO.
     * Si el juego solicitado es más caro, se paga la diferencia + la comisión.
     * Si el juego solicitado es más barato, el intercambio es gratis (no se devuelve dinero).
     */
    private ExchangeCost calculateExchangeCost(Game offeredGame, Game requestedGame) {
        BigDecimal offeredPrice = offeredGame.getPrice();
        BigDecimal requestedPrice = requestedGame.getPrice();
        
        // Calcular la diferencia de precios
        BigDecimal priceDifference = requestedPrice.subtract(offeredPrice);
        
        ExchangeCost cost = new ExchangeCost();
        cost.setOfferedGamePrice(offeredPrice);
        cost.setRequestedGamePrice(requestedPrice);
        cost.setPriceDifference(priceDifference);
        
        // Si el juego solicitado es más barato o de igual precio que el ofrecido, el intercambio es gratis.
        if (priceDifference.compareTo(BigDecimal.ZERO) <= 0) {
            cost.setAdditionalCost(BigDecimal.ZERO);
            cost.setReason("El juego solicitado es de menor o igual valor. No hay costo adicional.");
        } else {
            // Si el juego solicitado es más caro, se paga la diferencia más una comisión del 10% sobre el juego OFRECIDO.
            BigDecimal commission = offeredPrice.multiply(new BigDecimal("0.10"));
            BigDecimal totalAdditionalCost = priceDifference.add(commission);
            cost.setAdditionalCost(totalAdditionalCost);
            cost.setReason("Se paga la diferencia de precio más una comisión del 10% sobre el juego ofrecido.");
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
    public List<ExchangeDTO> getAllExchanges() {
        return exchangeRepository.findAll().stream()
                .map(exchange -> convertToDTO(exchange, null))
                .collect(Collectors.toList());
    }

    @Override
    public ExchangeDTO getExchangeById(Long id) {
        Exchange exchange = exchangeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intercambio no encontrado"));
        return convertToDTO(exchange, null);
    }

    @Override
    public List<ExchangeDTO> getUserExchanges(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return exchangeRepository.findByRequesterOrOwner(user, user).stream()
                .map(exchange -> convertToDTO(exchange, null))
                .collect(Collectors.toList());
    }

    private ExchangeDTO convertToDTO(Exchange exchange, ExchangeCost cost) {
        ExchangeDTO dto = new ExchangeDTO();
        dto.setId(exchange.getId());
        if (exchange.getRequester() != null) {
            dto.setRequesterId(exchange.getRequester().getId());
            dto.setRequesterUsername(exchange.getRequester().getUsername());
        }
        dto.setOfferedGameId(exchange.getOfferedGame().getId());
        dto.setOfferedGameTitle(exchange.getOfferedGame().getTitle());
        dto.setRequestedGameId(exchange.getRequestedGame().getId());
        dto.setRequestedGameTitle(exchange.getRequestedGame().getTitle());
        dto.setStatus(exchange.getStatus());
        dto.setExchangeDate(exchange.getExchangeDate());
        dto.setAdditionalCost(exchange.getAdditionalCost());
        if (cost != null) {
            dto.setCostReason(cost.getReason());
        }
        return dto;
    }

}