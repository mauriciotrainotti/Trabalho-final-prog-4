import React, { useState } from "react";
import './ModalAdicionarDespesa.css';


function ModalAdicionarDespesa({ isOpen, onClose, user, saldo, setSaldo }) {
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");

  if (!isOpen) return null;

  const handleSalvarDespesa = () => {
    const valorNumerico = parseFloat(valor);

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert("Por favor, insira um valor válido para a despesa.");
      return;
    }

    if (!data || !categoria || !descricao.trim()) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }

    if (saldo < valorNumerico) {
      alert("Saldo insuficiente para essa despesa.");
      return;
    }

    // Atualiza o saldo subtraindo a despesa
    const novoSaldo = saldo - valorNumerico;
    setSaldo(novoSaldo);

    // Aqui você pode adicionar a lógica para salvar no Firestore, se necessário.

    alert("Despesa adicionada com sucesso!");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Despesa</h2>

        <label>Valor:</label>
        <input
          type="number"
          placeholder="R$ 0,00"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <label>Data:</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <label>Categoria:</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{ width: "100%", padding: "8px" }} // Aumentando o tamanho
        >
          <option value="">Selecione uma categoria</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Casa">Casa</option>
          <option value="Contas Fixas">Contas Fixas</option>
          <option value="Educação">Educação</option>
          <option value="Automóvel">Automóvel</option>
          <option value="Saúde">Saúde</option>
          <option value="Lazer">Lazer</option>
          <option value="Transporte">Transporte</option>
          <option value="Investimentos">Investimentos</option>
          <option value="Roupas e Acessórios">Roupas e Acessórios</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Viagens">Viagens</option>
          <option value="Outros">Outros</option>
        </select>

        <label>Descrição:</label>
        <textarea
          placeholder="Descreva a despesa..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>

        <button onClick={handleSalvarDespesa} className="save-button">
          Salvar
        </button>
        <button onClick={onClose} className="close-button">
          Fechar
        </button>
      </div>
    </div>
  );
}

export default ModalAdicionarDespesa;
