package com.Scrum3.ArcadeStore.service;

import com.Scrum3.ArcadeStore.dto.ExchangeRequest;
import com.Scrum3.ArcadeStore.dto.ExchangeResponse;
import org.springframework.security.core.Authentication;
import java.util.List;

public interface ExchangeService {
    ExchangeResponse createExchange(ExchangeRequest request, Authentication authentication);
    List<ExchangeResponse> getAllExchanges();
    ExchangeResponse getExchangeById(Long id);
    List<ExchangeResponse> getUserExchanges(Authentication authentication);
}