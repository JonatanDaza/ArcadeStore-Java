package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Agreement;
import  com.Scrum3.ArcadeStore.Repository.GameRepository;
import com.Scrum3.ArcadeStore.Repository.AgreementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class AgreementService<id> {

    @Autowired
    private AgreementRepository agreementRepository;
    private GameRepository gameRepository;

    public List<Agreement> getAllAgreements() {
        return agreementRepository.findAll();
    }

    public Optional<Agreement> getAgreementById(Long id) {
        return agreementRepository.findById(id);
    }

    public Agreement createAgreement(Agreement agreement) {
        return agreementRepository.save(agreement);
    }

    public Object updateAgreement(Long id, Agreement agreementDetails) {
        Optional<Agreement> optionalAgreement = agreementRepository.findById(id);
        if (optionalAgreement.isPresent()) {
            Agreement existingAgreement = optionalAgreement.get();
            existingAgreement.setDetails(agreementDetails.getDetails());
            existingAgreement.setStartDate(agreementDetails.getStartDate());
            existingAgreement.setEndDate(agreementDetails.getEndDate());
            existingAgreement.setCompanyName(agreementDetails.getCompanyName());
            existingAgreement.setGames(agreementDetails.getGames());
            return agreementRepository.save(existingAgreement);
        } else {
            return null;
        }

    }

    public boolean desactiveAgreement(Long id) {
            return false;
    }
}


