package com.Scrum3.ArcadeStore.config;

import com.Scrum3.ArcadeStore.entities.Role;
import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.Repository.RoleRepository;
import com.Scrum3.ArcadeStore.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner initData(RoleRepository roleRepository, UserRepository userRepository) {
        return args -> {
            // Crear roles si no existen
            if (roleRepository.findByName("ADMIN").isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName("ADMIN");
                adminRole.setActive(true);
                adminRole.setDescription("Administrador");
                roleRepository.save(adminRole);
            }
            if (roleRepository.findByName("USER").isEmpty()) {
                Role userRole = new Role();
                userRole.setName("USER");
                userRole.setActive(true);
                userRole.setDescription("Usuario");
                roleRepository.save(userRole);
            }

            // Crear admin por defecto si no existe
            if (userRepository.findByEmail("admin@arcadestore.com").isEmpty()) {
                Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
                User admin = new User();
                admin.setEmail("admin@arcadestore.com");
                admin.setUsername("admin");
                admin.setActive(true);
                admin.setPasswordHash(passwordEncoder.encode("admin123")); // Contraseña por defecto
                admin.setRole(adminRole);
                userRepository.save(admin);
            }
        };
    }
}