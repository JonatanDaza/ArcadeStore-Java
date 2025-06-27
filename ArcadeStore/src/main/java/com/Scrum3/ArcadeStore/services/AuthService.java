package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.UserRepository;
import com.Scrum3.ArcadeStore.dto.RegisterRequest;
import com.Scrum3.ArcadeStore.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;

    public boolean login(String email, String passwordHash) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        User user = new User();
        if (optionalUser.isPresent()) {
            user = optionalUser.get();


            if (!user.is_active()) return false;

            return user.getPasswordHash().equals(passwordHash);
        }

        return new BCryptPasswordEncoder().matches(passwordHash, user.getPasswordHash());
    }

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "El correo ya está en uso.";
        }
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setUsername(request.getUsername());
        newUser.setRole(request.getRole() != null ? request.getRole() : "USER");
        newUser.setActive(true);

        newUser.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

        userRepository.save(newUser);
        return "Usuario registrado exitosamente.";
    }


}
