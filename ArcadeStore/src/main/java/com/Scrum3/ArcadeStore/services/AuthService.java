package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.UserRepository;
import com.Scrum3.ArcadeStore.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

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
}
