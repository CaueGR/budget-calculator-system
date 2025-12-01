package com.robattinidev.orcamento_marcenaria.controller;

import com.robattinidev.orcamento_marcenaria.dto.DadosCalculoDTO;
import com.robattinidev.orcamento_marcenaria.model.Material;
import com.robattinidev.orcamento_marcenaria.repository.MaterialRepository;
import com.robattinidev.orcamento_marcenaria.service.CalculadoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OrcamentoController {

    @Autowired private MaterialRepository repository;
    @Autowired private CalculadoraService service;

    @GetMapping("/materiais")
    public List<Material> listar() {
        return repository.findAll();
    }

    @PostMapping("/materiais")
    public Material criar(@RequestBody Material material) {
        return repository.save(material);
    }

    @PostMapping("/calcular")
    public Double calcular(@RequestBody DadosCalculoDTO dados) {
        return service.calcular(dados);
    }
}