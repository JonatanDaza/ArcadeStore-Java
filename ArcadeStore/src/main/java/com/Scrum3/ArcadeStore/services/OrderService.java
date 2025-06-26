package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Order;
import com.Scrum3.ArcadeStore.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, Order orderDetails) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order existingOrder = optionalOrder.get();
            existingOrder.setOrderDate(orderDetails.getOrderDate());
            existingOrder.setOrderStatus(orderDetails.getOrderStatus());
            existingOrder.setProductQuantity(orderDetails.getProductQuantity());
            existingOrder.setUser(orderDetails.getUser());
            return orderRepository.save(existingOrder);
        } else {
            return null;
        }
    }
}