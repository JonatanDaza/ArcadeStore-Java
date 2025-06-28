package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.GameRepository;
import com.Scrum3.ArcadeStore.entities.Category;
import com.Scrum3.ArcadeStore.Repository.CategoryRepository;
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
        Category category = categoryRepository.findById(id).orElseThrow();
        boolean tieneJuegosActivos = gameRepository.existsByCategoryIdAndActiveTrue(id);

        if (!tieneJuegosActivos) {
            category.setActive(false);
            categoryRepository.save(category);
            return true;
        }
        return false;
    }

    public void activarCategoria(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow();
        category.setActive(true);
        categoryRepository.save(category);
    }

}