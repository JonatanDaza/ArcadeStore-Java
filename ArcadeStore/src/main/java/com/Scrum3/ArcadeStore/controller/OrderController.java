package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.entities.Order;
import com.Scrum3.ArcadeStore.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(order -> new ResponseEntity<>(order, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        Order updatedOrder = orderService.updateOrder(id, orderDetails);
        if (updatedOrder != null) {
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadOrderPdf(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(order -> {
                    try {
                        byte[] pdfBytes = generateOrderPdf(order);

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_PDF);
                        headers.setContentDispositionFormData(
                                "attachment", "orden-" + order.getId() + ".pdf");

                        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
                    } catch (Exception e) {
                        return new ResponseEntity<byte[]>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    private byte[] generateOrderPdf(Order order) {
        return null;
    }

}
