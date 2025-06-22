package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Agreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgreementRepository extends JpaRepository<Agreement, Long> {
}
