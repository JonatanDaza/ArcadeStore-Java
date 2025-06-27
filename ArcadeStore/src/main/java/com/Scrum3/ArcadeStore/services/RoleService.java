package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.UserRepository;
import com.Scrum3.ArcadeStore.entities.Role;
import com.Scrum3.ArcadeStore.Repository.RoleRepository;
import com.Scrum3.ArcadeStore.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;
    private UserRepository userRepository;


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
            Role existingRole = optionalRole.get();
            existingRole.setName(roleDetails.getName());
            existingRole.setDescription(roleDetails.getDescription());
            return roleRepository.save(existingRole);
        } else {
            return null;
        }
    }

    public boolean cambiarRolSiActivo(Long userId) {
        Optional<Role> userOptional = roleRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (!user.isActive()) {
                return false;
            }

            Role rolActual = user.getRole();

            if ("ADMIN".equalsIgnoreCase(String.valueOf(rolActual))) {
                user.setRole("USER");
            } else {
                user.setRole("ADMIN");
            }
            return false;
        }
        return false;
    }
}