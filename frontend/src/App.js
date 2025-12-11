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
  
  const [novoMaterialNome, setNovoMaterialNome] = useState("");
  const [novoMaterialPreco, setNovoMaterialPreco] = useState("");

  const cadastrarMaterial = () => {
    if (!novoMaterialNome || !novoMaterialPreco) {
      alert("Preencha nome e preço!");
      return;
    }

    const novo = {
      name: novoMaterialNome, // Usando 'name' para bater com seu Java
      precoCusto: parseFloat(novoMaterialPreco)
    };

    axios.post("http://localhost:8080/api/materiais", novo)
      .then(resposta => {
        alert("Material cadastrado com sucesso!");
        // Adiciona o novo material na lista que já está na tela
        setMateriaisBanco([...materiaisBanco, resposta.data]);
        // Limpa os campos
        setNovoMaterialNome("");
        setNovoMaterialPreco("");
      })
      .catch(erro => alert("Erro ao cadastrar: " + erro));
  };

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
  // --- 4. TELA (HTML) ---
  return (
    <div className="container mt-4 mb-5">
      <h2 className="text-center mb-4">💰 Orçamento Marcenaria</h2>

      {/* --- BLOCO 1: CADASTRAR NOVO MATERIAL (Separado e no topo) --- */}
      <div className="card shadow-sm mb-4 border-warning">
        <div className="card-header bg-warning text-dark fw-bold">
          🛠️ Cadastrar Novo Material (Banco de Dados)
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-5">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nome do Material (Ex: Cola Branca)"
                value={novoMaterialNome}
                onChange={e => setNovoMaterialNome(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Preço (R$)"
                value={novoMaterialPreco}
                onChange={e => setNovoMaterialPreco(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button className="btn btn-outline-dark w-100" onClick={cadastrarMaterial}>
                Salvar no Estoque
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- BLOCO 2: MONTAR O ORÇAMENTO --- */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">1. Adicionar ao Orçamento</div>
        <div className="card-body">
          <div className="mb-3">
            <label>Escolha o Material:</label>
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
              <button className="btn btn-success w-100" onClick={adicionarAoCarrinho}>+ Adicionar Item</button>
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

      {/* CARD 3: Configurações Finais */}
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