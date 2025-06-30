package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}/show")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        // Este endpoint podría necesitar una autorización más específica (ej. admin o el propio usuario)
        // Por ahora, lo dejamos accesible para usuarios autenticados para no romper otras funcionalidades.
        return userService.getUserById(id)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        if (updatedUser != null) {
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivarUsuario(@PathVariable Long id, Principal principal) {

        // Un administrador no puede desactivarse a sí mismo.
        String authEmail = principal.getName();
        if (userService.isSameUser(id, authEmail)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        boolean exito = userService.desactiveUser(id);

        if (exito) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> cambiarRolUsuario(@PathVariable Long id) {
        if (userService.cambiarRolSiActivo(id)) {
            return ResponseEntity.ok("Rol actualizado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("No se puede cambiar el rol porque el usuario está desactivado o no existe");
        }
    }
}