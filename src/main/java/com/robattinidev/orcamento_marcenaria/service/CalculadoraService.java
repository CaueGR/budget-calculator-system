package com.robattinidev.orcamento_marcenaria.service;

import com.robattinidev.orcamento_marcenaria.dto.DadosCalculoDTO;
import org.springframework.stereotype.Service;

@Service
public class CalculadoraService {

    public Double calcular(DadosCalculoDTO dados) {
        // 1. Soma total dos materiais
        double totalMateriais = dados.getItens().stream()
                .mapToDouble(item -> item.getPrecoUnitario() * item.getQuantidade())
                .sum();

        // 2. Aplica a margem de lucro (ex: +30%)
        double comMargem = totalMateriais + (totalMateriais * (dados.getMargemLucro() / 100));

        // 3. Verifica se deve dobrar ou triplicar
        if ("TRIPLICAR".equalsIgnoreCase(dados.getMultiplicador())) {
            return comMargem * 3;
        } else if ("DOBRAR".equalsIgnoreCase(dados.getMultiplicador())) {
            return comMargem * 2;
        }

        return comMargem; // Retorna normal se não for nem dobrar nem triplicar
    }
}