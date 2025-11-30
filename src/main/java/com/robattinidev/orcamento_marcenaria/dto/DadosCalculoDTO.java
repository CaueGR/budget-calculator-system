package com.robattinidev.orcamento_marcenaria.dto;

import lombok.Data;
import java.util.List;

@Data
public class DadosCalculoDTO {
    private List<ItemMaterialDTO> itens;
    private Double margemLucro;
    private String multiplicador;

    @Data
    public static class ItemMaterialDTO {
        private String nome;
        private Double precoUnitario;
        private Integer quantidade;
    }
}