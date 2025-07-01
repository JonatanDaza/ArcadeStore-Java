package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.SaleRepository;
import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.Repository.UserRepository;
import com.Scrum3.ArcadeStore.Repository.RoleRepository;
import com.Scrum3.ArcadeStore.dto.GameDTO;
import com.Scrum3.ArcadeStore.entities.Game;
import com.Scrum3.ArcadeStore.entities.Sale;
import com.Scrum3.ArcadeStore.entities.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SaleRepository saleRepository;

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {

        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setUsername(userDetails.getUsername());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setRole(userDetails.getRole()); // userDetails.getRole() debe ser un objeto Role
            return userRepository.save(existingUser);
        } else {
            return null;
        }
    }

    public boolean desactiveUser(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setActive(false);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean isSameUser(Long id, String authEmail) {
        return userRepository.findById(id)
                .map(user -> user.getEmail().equals(authEmail))
                .orElse(false);
    }

    public void asignarRolAUsuario(Long userId, String nombreRol) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Role role = roleRepository.findByName(nombreRol).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        user.setRole(role);
        userRepository.save(user);
    }

    public boolean cambiarRolSiActivo(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (!user.isActive()) {
                return false;
            }

            Role rolActual = user.getRole();

            if ("ADMIN".equalsIgnoreCase(rolActual.getName())) {
                Role userRole = roleRepository.findByName("USER")
                        .orElseThrow(() -> new RuntimeException("Rol USER no encontrado"));
                user.setRole(userRole);
            } else {
                Role adminRole = roleRepository.findByName("ADMIN")
                        .orElseThrow(() -> new RuntimeException("Rol ADMIN no encontrado"));
                user.setRole(adminRole);
            }
            userRepository.save(user);
            return true;
        }
        return false;
    }

    // ✅ NUEVO: Obtener la biblioteca de juegos de un usuario
    @Transactional(readOnly = true)
    public List<GameDTO> getUserLibrary(User user) {
        return saleRepository.findByUser(user).stream()
                .map(Sale::getGame) // De cada venta, obtenemos el juego
                .distinct() // Nos aseguramos de que cada juego aparezca solo una vez
                .map(GameDTO::new) // Convertimos la entidad Game a GameDTO
                .collect(Collectors.toList());
    }

    public boolean isCurrentUser(Long userId, String userEmail) {
        return getUserByEmail(userEmail)
                .map(user -> user.getId().equals(userId))
                .orElse(false);
    }
}