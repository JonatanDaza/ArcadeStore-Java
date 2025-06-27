package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.entities.Category;
import com.Scrum3.ArcadeStore.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/{id}/show")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .map(category -> new ResponseEntity<>(category, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/create")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category newCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category Category) {
        Category updatedCategory = categoryService.updateCategory(id, Category);
        if (updatedCategory != null) {
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<String> changeCategoryStatus(@PathVariable Long id, @RequestParam boolean active) {
        if (!active) {
            // Si se quiere desactivar, primero verificar que no tenga juegos activos
            boolean desactivado = categoryService.desactivarCategoriaSiNoTieneJuegosActivos(id);
            if (desactivado) {
                return ResponseEntity.noContent().build(); // 204 No Content
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("No se puede desactivar la categoría porque contiene juegos activos.");
            }
        } else {
            // Activar directamente sin validación
            categoryService.activarCategoria(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        }
    }

}