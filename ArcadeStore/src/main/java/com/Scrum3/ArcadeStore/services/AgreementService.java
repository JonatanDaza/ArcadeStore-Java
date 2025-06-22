package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Agreement;
import com.Scrum3.ArcadeStore.Repository.AgreementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgreementService {

    @Autowired
    private AgreementRepository agreementRepository;

    public List<Agreement> getAllAgreements() {
        return agreementRepository.findAll();
    }

    public Optional<Agreement> getAgreementById(Long id) {
        return agreementRepository.findById(id);
    }

    public Agreement createAgreement(Agreement agreement) {
        return agreementRepository.save(agreement);
    }

    public Agreement updateAgreement(Long id, Agreement agreementDetails) {
        Optional<Agreement> optionalAgreement = agreementRepository.findById(id);
        if (optionalAgreement.isPresent()) {
            Agreement existingAgreement = optionalAgreement.get();
            existingAgreement.setAgreementType(agreementDetails.getAgreementType());
            existingAgreement.setStartDate(agreementDetails.getStartDate());
            existingAgreement.setEndDate(agreementDetails.getEndDate());
            existingAgreement.setUser(agreementDetails.getUser());
            existingAgreement.setGame(agreementDetails.getGame());
            return agreementRepository.save(existingAgreement);
        } else {
            return null;
        }
    }

    public boolean deleteAgreement(Long id) {
        if (agreementRepository.existsById(id)) {
            agreementRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}