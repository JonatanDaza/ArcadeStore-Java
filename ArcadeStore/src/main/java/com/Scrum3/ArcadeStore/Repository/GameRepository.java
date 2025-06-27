package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByAgreementId(Long agreementId);
    boolean existsByAgreementIdAndActiveTrue(Long agreementId);
    boolean existsByCategoryIdAndActiveTrue(Long categoryId);
}