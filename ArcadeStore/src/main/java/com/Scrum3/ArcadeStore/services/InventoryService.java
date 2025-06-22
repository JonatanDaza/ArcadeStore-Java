package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Inventory;
import com.Scrum3.ArcadeStore.Repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> getAllInventories() {
        return inventoryRepository.findAll();
    }

    public Optional<Inventory> getInventoryById(Long id) {
        return inventoryRepository.findById(id);
    }

    public Inventory createInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Long id, Inventory inventoryDetails) {
        Optional<Inventory> optionalInventory = inventoryRepository.findById(id);
        if (optionalInventory.isPresent()) {
            Inventory existingInventory = optionalInventory.get();
            existingInventory.setQuantityInStock(inventoryDetails.getQuantityInStock());
            existingInventory.setProduct(inventoryDetails.getProduct());
            return inventoryRepository.save(existingInventory);
        } else {
            return null;
        }
    }

    public boolean deleteInventory(Long id) {
        if (inventoryRepository.existsById(id)) {
            inventoryRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}