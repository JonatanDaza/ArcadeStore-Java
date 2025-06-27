package com.Scrum3.ArcadeStore.controller;

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

    @GetMapping
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

    @PostMapping
    public ResponseEntity<Agreement> createAgreement(@RequestBody Agreement agreement) {
        Agreement createdAgreement = agreementService.createAgreement(agreement);
        return new ResponseEntity<>(createdAgreement, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agreement> updateAgreement(@PathVariable Long id, @RequestBody Agreement agreementDetails) {
        Agreement updatedAgreement = (Agreement) agreementService.updateAgreement(id, agreementDetails);
        if (updatedAgreement != null) {
            return new ResponseEntity<>(updatedAgreement, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/desactivar/{id}")
    public ResponseEntity<String> desactiveAgreement(@PathVariable Long id) {
        boolean desactive = agreementService.desactiveAgreement(id);
        if (desactive) {
            return ResponseEntity.ok("Convenio desactivado.");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("No se puede desactivar: Hay juegos activos asociados.");
        }
    }

}
