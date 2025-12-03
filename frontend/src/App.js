import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // --- ESTADOS (Memória do App) ---
  const [materiaisBanco, setMateriaisBanco] = useState([]); // Lista que vem do Java
  
  const [materialSelecionadoId, setMaterialSelecionadoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  
  const [carrinho, setCarrinho] = useState([]); // Itens que o usuário adicionou
  const [margem, setMargem] = useState(0);
  const [multiplicador, setMultiplicador] = useState("NORMAL"); // NORMAL, DOBRAR, TRIPLICAR
  
  const [valorFinal, setValorFinal] = useState(null); // Resultado do cálculo

  // --- 1. BUSCAR MATERIAIS NO JAVA (Ao carregar a tela) ---
  useEffect(() => {
    axios.get("http://localhost:8080/api/materiais")
      .then(resposta => {
        setMateriaisBanco(resposta.data);
      })
      .catch(erro => console.error("Erro ao buscar materiais. O Java tá rodando?", erro));
  }, []);

  // --- 2. ADICIONAR ITEM NA LISTA LOCAL ---
  const adicionarAoCarrinho = () => {
    if(!materialSelecionadoId) return; // Se não escolheu nada, não faz nada

    // Acha o objeto material completo baseada no ID selecionado
    const materialOriginal = materiaisBanco.find(m => m.id.toString() === materialSelecionadoId);

    // Cria o objeto bonitinho
    const novoItem = {
      nome: materialOriginal.name,
      precoUnitario: materialOriginal.precoCusto,
      quantidade: parseInt(quantidade)
    };

    // Adiciona na lista mantendo o que já tinha antes (...carrinho)
    setCarrinho([...carrinho, novoItem]);
  };

  // --- 3. MANDAR CALCULAR NO JAVA ---
  const calcularOrcamento = () => {
    // Monta o JSON igualzinho ao que fizemos no Postman
    const dadosParaEnvio = {
      itens: carrinho,
      margemLucro: parseFloat(margem),
      multiplicador: multiplicador
    };

    axios.post("http://localhost:8080/api/calcular", dadosParaEnvio)
      .then(resposta => {
        setValorFinal(resposta.data); // O Java devolve o número (ex: 690.0)
      })
      .catch(erro => alert("Erro ao calcular! Veja o console."));
  };

  // --- 4. TELA (HTML) ---
  return (
    <div className="container mt-4 mb-5">
      <h2 className="text-center mb-4">💰 Orçamento Marcenaria</h2>

      {/* CARD 1: Adicionar Materiais */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">1. Adicionar Materiais</div>
        <div className="card-body">
          <div className="mb-3">
            <label>Material:</label>
            <select className="form-select" onChange={e => setMaterialSelecionadoId(e.target.value)}>
              <option value="">Selecione...</option>
              {materiaisBanco.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} (R$ {m.precoCusto})
                </option>
              ))}
            </select>
          </div>
          
          <div className="row">
            <div className="col-6">
              <label>Quantidade:</label>
              <input type="number" className="form-control" value={quantidade} onChange={e => setQuantidade(e.target.value)} />
            </div>
            <div className="col-6 d-flex align-items-end">
              <button className="btn btn-success w-100" onClick={adicionarAoCarrinho}>+ Adicionar</button>
            </div>
          </div>
        </div>
      </div>

      {/* LISTA DE ITENS ADICIONADOS */}
      {carrinho.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">Itens no Projeto</div>
          <ul className="list-group list-group-flush">
            {carrinho.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                <span>{item.quantidade}x {item.nome}</span>
                <span className="text-muted">R$ {item.precoUnitario * item.quantidade}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CARD 2: Configurações Finais */}
      <div className="card shadow-sm bg-light">
        <div className="card-body">
          <h5 className="card-title">2. Fechamento</h5>
          
          <div className="mb-3">
            <label>Margem de Lucro (%):</label>
            <input type="number" className="form-control" placeholder="Ex: 30" 
                   value={margem} onChange={e => setMargem(e.target.value)} />
          </div>

          <div className="mb-3">
            <label>Regra Final:</label>
            <select className="form-select" value={multiplicador} onChange={e => setMultiplicador(e.target.value)}>
              <option value="NORMAL">Normal (Apenas soma + margem)</option>
              <option value="DOBRAR">Dobrar Valor (x2)</option>
              <option value="TRIPLICAR">Triplicar Valor (x3)</option>
            </select>
          </div>

          <button className="btn btn-dark btn-lg w-100 mt-2" onClick={calcularOrcamento}>
            CALCULAR TOTAL
          </button>
        </div>
      </div>

      {/* RESULTADO FINAL */}
      {valorFinal !== null && (
        <div className="alert alert-success mt-4 text-center">
          <h4>Valor do Orçamento:</h4>
          <h1 className="display-4 fw-bold">R$ {valorFinal.toFixed(2)}</h1>
        </div>
      )}

    </div>
  );
}

export default App;