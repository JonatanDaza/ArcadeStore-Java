package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.CategoryRepository;
import com.Scrum3.ArcadeStore.Repository.GameRepository;
import com.Scrum3.ArcadeStore.entities.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private GameRepository gameRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isPresent()) {
            Category existingCategory = optionalCategory.get();
            existingCategory.setName(categoryDetails.getName());
            existingCategory.setDescription(categoryDetails.getDescription());
            existingCategory.setActive(categoryDetails.isActive()); // ✅ Cambiado de getActive() a isActive()
            return categoryRepository.save(existingCategory);
        } else {
            return null;
        }
    }

    public boolean desactivarCategoriaSiNoTieneJuegosActivos(Long id) {
        try {
            Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
            
            // Verificar si la categoría tiene juegos activos
            boolean tieneJuegosActivos = gameRepository.existsByCategoryIdAndActiveTrue(id);
            
            if (!tieneJuegosActivos) {
                category.setActive(false);
                categoryRepository.save(category);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Error al desactivar categoría: " + e.getMessage(), e);
        }
    }

    public void activarCategoria(Long id) {
        try {
            Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
            category.setActive(true);
            categoryRepository.save(category);
        } catch (Exception e) {
            throw new RuntimeException("Error al activar categoría: " + e.getMessage(), e);
        }
    }
}