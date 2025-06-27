package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {
}