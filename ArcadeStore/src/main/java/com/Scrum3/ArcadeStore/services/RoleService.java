package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.UserRepository;
import com.Scrum3.ArcadeStore.Repository.RoleRepository;
import com.Scrum3.ArcadeStore.entities.User;
import com.Scrum3.ArcadeStore.entities.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;

    public boolean cambiarRolSiActivo(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (!user.isActive()) {
                return false;
            }

            Role rolActual = user.getRole();

            if ("ADMIN".equalsIgnoreCase(rolActual.getName())) {
                Role userRole = roleRepository.findByName("USER").orElseThrow(() -> new RuntimeException("Rol USER no encontrado"));
                user.setRole(userRole);
            } else {
                Role adminRole = roleRepository.findByName("ADMIN").orElseThrow(() -> new RuntimeException("Rol ADMIN no encontrado"));
                user.setRole(adminRole);
            }
            userRepository.save(user);
            return true;
        }
        return false;
    }

    // Métodos CRUD mínimos para que compile el controlador
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Optional<Role> getRoleById(Long id) {
        return roleRepository.findById(id);
    }

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    public Role updateRole(Long id, Role roleDetails) {
        Optional<Role> optionalRole = roleRepository.findById(id);
        if (optionalRole.isPresent()) {
            Role role = optionalRole.get();
            role.setName(roleDetails.getName());
            role.setDescription(roleDetails.getDescription());
            role.setActive(roleDetails.isActive());
            return roleRepository.save(role);
        }
        return null;
    }
}