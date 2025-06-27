package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    static boolean existsByCategoriaIdAndActivoTrue(Long id) {
        return false;
    }
}