package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<com.Scrum3.ArcadeStore.entities.User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}

