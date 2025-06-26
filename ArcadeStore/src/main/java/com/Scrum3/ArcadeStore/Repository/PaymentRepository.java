package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
