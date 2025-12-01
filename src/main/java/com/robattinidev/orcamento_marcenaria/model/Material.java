package com.robattinidev.orcamento_marcenaria.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double precoCusto;
}
