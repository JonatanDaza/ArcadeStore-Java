package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.GameRepository;
import com.Scrum3.ArcadeStore.Repository.OrderRepository;
import com.Scrum3.ArcadeStore.Repository.PaymentRepository;
import com.Scrum3.ArcadeStore.dto.SaleDTO;
import com.Scrum3.ArcadeStore.dto.CheckoutRequestDTO;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.entities.Order;
import com.Scrum3.ArcadeStore.entities.Payment;
import com.Scrum3.ArcadeStore.entities.Sale;
import com.Scrum3.ArcadeStore.Repository.SaleRepository;
import com.Scrum3.ArcadeStore.entities.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public List<SaleDTO> getAllSalesAsDTO() {
        return saleRepository.findAll().stream()
                .map(SaleDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<Sale> getSaleById(Long id) {
        return saleRepository.findById(id);
    }

    public Sale createSale(Sale sale) {
        return saleRepository.save(sale);
    }

    public Sale updateSale(Long id, Sale saleDetails) {
        Optional<Sale> optionalSale = saleRepository.findById(id);
        if (optionalSale.isPresent()) {
            Sale existingSale = optionalSale.get();
            existingSale.setSaleDate(saleDetails.getSaleDate());
            existingSale.setTotalAmount(saleDetails.getTotalAmount());
            existingSale.setPaymentMethod(saleDetails.getPaymentMethod());
            existingSale.setUser(saleDetails.getUser());
            return saleRepository.save(existingSale);
        } else {
            return null;
        }
    }

    public boolean SaleDesactive(Long id) {
        Optional<Sale> ventaOptional = saleRepository.findById(id);

        if (ventaOptional.isPresent()) {
            Sale venta = ventaOptional.get();
            venta.setActive(false);
            saleRepository.save(venta);
            return true;
        }

        return false;
    }
    public List<Sale> getSalesWithFilters(Map<String, Object> filters) {
        // Implement logic to filter sales based on the provided filters
        // This is a placeholder implementation; actual filtering logic will depend on the requirements
        return saleRepository.findAll(); // Replace with actual filtering logic
    }

    @Transactional
    public List<Sale> createSalesFromCart(CheckoutRequestDTO request, User user) {
        List<Sale> createdSales = new ArrayList<>();
        if (request.getGameIds() == null || request.getGameIds().isEmpty()) {
            throw new IllegalArgumentException("La lista de IDs de juegos no puede estar vacía.");
        }
        
        // 1. Obtener todos los juegos y calcular el monto total
        List<Game> gamesInCart = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (Long gameId : request.getGameIds()) {
            Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Juego no encontrado con ID: " + gameId));
            gamesInCart.add(game);
            totalAmount = totalAmount.add(BigDecimal.valueOf(game.getPrice()));
        }

        // 2. Crear la Orden
        Order newOrder = new Order();
        newOrder.setUser(user);
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setOrderStatus("COMPLETADA");
        newOrder.setProductQuantity(gamesInCart.size());
        Order savedOrder = orderRepository.save(newOrder);

        // 3. Crear el Pago asociado a la Orden
        Payment newPayment = new Payment();
        newPayment.setOrder(savedOrder);
        newPayment.setAmount(totalAmount);
        newPayment.setPaymentMethod(request.getPaymentMethod());
        // Si es gratuito, el estado del pago podría ser "N/A" o "Completado".
        // Aquí asumimos que se registra de todas formas para mantener la consistencia.
        paymentRepository.save(newPayment);

        // 4. Crear los registros de Venta (Sale) asociados a la Orden
        for (Game game : gamesInCart) {
            Sale newSale = new Sale();
            newSale.setUser(user);
            newSale.setGame(game);
            newSale.setOrder(savedOrder); // Asociar la venta con la orden
            newSale.setSaleDate(LocalDateTime.now());
            newSale.setTotalAmount(BigDecimal.valueOf(game.getPrice()));
            newSale.setPaymentMethod(request.getPaymentMethod());
            newSale.setActive(true);

            createdSales.add(saleRepository.save(newSale));
        }

        return createdSales;
    }
}