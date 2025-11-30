package com.robattinidev.orcamento_marcenaria.repository;

import com.robattinidev.orcamento_marcenaria.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
}