package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Payment;
import com.Scrum3.ArcadeStore.Repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment updatePayment(Long id, Payment paymentDetails) {
        Optional<Payment> optionalPayment = paymentRepository.findById(id);
        if (optionalPayment.isPresent()) {
            Payment existingPayment = optionalPayment.get();
            existingPayment.setPaymentMethod(paymentDetails.getPaymentMethod());
            existingPayment.setAmount(paymentDetails.getAmount());
            existingPayment.setUser(paymentDetails.getUser());
            existingPayment.setExchange(paymentDetails.getExchange());
            return paymentRepository.save(existingPayment);
        } else {
            return null;
        }
    }

    public boolean deletePayment(Long id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}