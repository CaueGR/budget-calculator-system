package com.robattinidev.orcamento_marcenaria.config; // Ou o seu pacote principal

import com.robattinidev.orcamento_marcenaria.model.Material;
import com.robattinidev.orcamento_marcenaria.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CargaDeDados implements CommandLineRunner {

    @Autowired
    private MaterialRepository repository;

    @Override
    public void run(String... args) throws Exception {
        // Só cria se o banco estiver vazio
        if (repository.count() == 0) {
            Material m1 = new Material();
            m1.setName("MDF 15mm Branco (Chapa)");
            m1.setPrecoCusto(180.00);
            repository.save(m1);

            Material m2 = new Material();
            m2.setName("Puxador Alumínio (Un)");
            m2.setPrecoCusto(12.50);
            repository.save(m2);

            Material m3 = new Material();
            m3.setName("Corrediça Telescópica (Par)");
            m3.setPrecoCusto(25.00);
            repository.save(m3);

            System.out.println("--- DADOS DE TESTE CARREGADOS NO BANCO ---");
        }
    }
}