package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
}
