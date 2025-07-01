package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Exchange;
import com.Scrum3.ArcadeStore.Repository.ExchangeRepository;
import com.Scrum3.ArcadeStore.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("exchangeSecurityService")
public class ExchangeSecurityService {

    @Autowired
    private ExchangeRepository exchangeRepository;

    public boolean isOwner(Authentication authentication, Long exchangeId) {
        String userEmail = authentication.getName();
        Exchange exchange = exchangeRepository.findById(exchangeId).orElse(null);

        if (exchange == null) {
            return false;
        }

        // Permite el acceso si el usuario es el solicitante o el propietario del juego
        return exchange.getRequester().getEmail().equals(userEmail) ||
               exchange.getOwner().getEmail().equals(userEmail);
    }
}
