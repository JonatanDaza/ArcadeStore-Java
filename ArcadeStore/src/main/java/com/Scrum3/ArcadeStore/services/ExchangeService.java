package com.Scrum3.ArcadeStore.service;

import com.Scrum3.ArcadeStore.dto.ExchangeDTO;
import com.Scrum3.ArcadeStore.dto.ExchangeRequest;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ExchangeService {

    ExchangeDTO createExchange(ExchangeRequest request, Authentication authentication);

    List<ExchangeDTO> getAllExchanges();

    ExchangeDTO getExchangeById(Long id);

    List<ExchangeDTO> getUserExchanges(Authentication authentication);
}
