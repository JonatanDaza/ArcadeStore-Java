package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.UserRepository;
import com.Scrum3.ArcadeStore.Repository.RoleRepository;
import com.Scrum3.ArcadeStore.dto.RegisterRequest;
import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.entities.Role;
import com.Scrum3.ArcadeStore.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Bean;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public boolean login(String email, String passwordHash) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (!user.isActive()) return false;

            return passwordEncoder.matches(passwordHash, user.getPasswordHash());
        }

        return false;
    }

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "El correo ya está en uso.";
        }
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setUsername(request.getUsername());
        newUser.setActive(true);
        newUser.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

        // Asignar siempre el rol USER (id=2)
        Role role = roleRepository.findById(2L).orElse(null);
        if (role == null) {
            return "No se encontró el rol USER por defecto. Contacte al administrador.";
        }
        newUser.setRole(role);

        userRepository.save(newUser);
        return "Usuario registrado exitosamente.";
    }

    public String loginAndGetToken(String email, String passwordHash) {
        System.out.println("Intentando login para: " + email);
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            System.out.println("Usuario encontrado: " + user.getEmail());

            if (!user.isActive()) {
                System.out.println("Usuario inactivo");
                return null;
            }

            System.out.println("Comparando contraseñas...");
            if (passwordEncoder.matches(passwordHash, user.getPasswordHash())) {
                System.out.println("Login exitoso");
                return jwtUtil.generateToken(user);
            } else {
                System.out.println("Contraseña incorrecta");
            }
        } else {
            System.out.println("Usuario no encontrado");
        }
        return null;
    }
}
