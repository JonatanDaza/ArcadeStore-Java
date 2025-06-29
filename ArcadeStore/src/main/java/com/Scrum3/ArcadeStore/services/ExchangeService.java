package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Exchange;
import com.Scrum3.ArcadeStore.Repository.ExchangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExchangeService {

    @Autowired
    private ExchangeRepository exchangeRepository;

    public List<Exchange> getAllExchanges() {
        return exchangeRepository.findAll();
    }

    public Optional<Exchange> getExchangeById(Long id) {
        return exchangeRepository.findById(id);
    }

    public Exchange createExchange(Exchange exchange) {
        return exchangeRepository.save(exchange);
    }

    public Exchange updateExchange(Long id, Exchange exchangeDetails) {
        Optional<Exchange> optionalExchange = exchangeRepository.findById(id);
        if (optionalExchange.isPresent()) {
            Exchange existingExchange = optionalExchange.get();
            existingExchange.setTradeStatus(exchangeDetails.getTradeStatus());
            existingExchange.setTradeDate(exchangeDetails.getTradeDate());
            existingExchange.setAdditionalCost(exchangeDetails.getAdditionalCost());
            existingExchange.setUser(exchangeDetails.getUser());
            existingExchange.setGame(exchangeDetails.getGame()); // <-- CAMBIA ESTO
            return exchangeRepository.save(existingExchange);
        } else {
            return null;
        }
    }

    public boolean deleteExchange(Long id) {
        if (exchangeRepository.existsById(id)) {
            exchangeRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}