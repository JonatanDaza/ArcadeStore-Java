package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Category;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        // Aquí podrías añadir lógica de negocio adicional antes de guardar
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isPresent()) {
            Category existingCategory = optionalCategory.get();
            existingCategory.setName(categoryDetails.getName());
            existingCategory.setDescription(categoryDetails.getDescription());
            existingCategory.setActive(categoryDetails.getActive());
            // createdAt no debería actualizarse, updatedAt lo hace automáticamente
            return categoryRepository.save(existingCategory);
        } else {
            return null; // O lanzar una excepción ResourceNotFoundException
        }
    }

    public boolean desactivarCategoriaSiNoTieneJuegosActivos(Long id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();

            boolean tieneJuegosActivos = category.getGames()
                    .stream()
                    .anyMatch(Game::is_active);

            if (tieneJuegosActivos) {
                return false;
            }

            category.setActive(false);
            categoryRepository.save(category);
            return true;
        }
        return false;
    }
    }