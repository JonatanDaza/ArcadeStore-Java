package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Sale;
import com.Scrum3.ArcadeStore.Repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Optional<Sale> getSaleById(Long id) {
        return saleRepository.findById(id);
    }

    public Sale createSale(Sale sale) {
        return saleRepository.save(sale);
    }

    public Sale updateSale(Long id, Sale saleDetails) {
        Optional<Sale> optionalSale = saleRepository.findById(id);
        if (optionalSale.isPresent()) {
            Sale existingSale = optionalSale.get();
            existingSale.setSaleDate(saleDetails.getSaleDate());
            existingSale.setTotalAmount(saleDetails.getTotalAmount());
            existingSale.setPaymentMethod(saleDetails.getPaymentMethod());
            existingSale.setUser(saleDetails.getUser());
            return saleRepository.save(existingSale);
        } else {
            return null;
        }
    }

    public boolean SaleDesactive(Long id) {
        Optional<Sale> ventaOptional = saleRepository.findById(id);

        if (ventaOptional.isPresent()) {
            Sale venta = ventaOptional.get();
            venta.setActive(false);
            saleRepository.save(venta);
            return true;
        }

        return false;
    }
}