package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}