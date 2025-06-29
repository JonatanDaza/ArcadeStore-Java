package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.Repository.AgreementRepository;
import com.Scrum3.ArcadeStore.entities.Agreement;
import com.Scrum3.ArcadeStore.services.AgreementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agreements")
public class AgreementController {

    @Autowired
    private AgreementService agreementService;

    @GetMapping("/all")
    public ResponseEntity<List<Agreement>> getAllAgreements() {
        List<Agreement> agreements = agreementService.getAllAgreements();
        return new ResponseEntity<>(agreements, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public Object getAgreementById(@PathVariable Long id) {
        return agreementService.getAgreementById(id)
                .map(agreement -> new ResponseEntity<>(agreement, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/create")
    public ResponseEntity<Agreement> createAgreement(@RequestBody Agreement agreement) {
        Agreement createdAgreement = agreementService.createAgreement(agreement);
        return new ResponseEntity<>(createdAgreement, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<Agreement> updateAgreement(@PathVariable Long id, @RequestBody Agreement agreementDetails) {
        Agreement updatedAgreement = (Agreement) agreementService.updateAgreement(id, agreementDetails);
        if (updatedAgreement != null) {
            return new ResponseEntity<>(updatedAgreement, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<String> changeAgreementStatus(@PathVariable Long id, @RequestParam boolean active) {
        if (!active) {
            boolean desactivado = agreementService.desactivarConvenioSINoTieneJuegoActivo(id);
            if (desactivado) {
                return ResponseEntity.noContent().build(); // 204 No Content
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("No se puede desactivar el convenio porque tiene un juego activo.");
            }
        } else {
            agreementService.activarConvenio(id);
            return ResponseEntity.noContent().build();
        }
    }

}
