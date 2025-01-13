import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./ModalAdicionarDespesa.css";

function ModalAdicionarDespesa({ isOpen, onClose, user, saldo, setSaldo, adicionarDespesaNoEstado }) {
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    if (user) {
      const carregarDespesas = async () => {
        const despesasRef = collection(db, "despesas");
        const querySnapshot = await getDocs(despesasRef);
        const despesasList = [];
        querySnapshot.forEach((doc) => {
          despesasList.push({ id: doc.id, ...doc.data() });
        });
        setDespesas(despesasList);
      };

      carregarDespesas();
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSalvarDespesa = async () => {
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

    // Criando o objeto da despesa
    const novaDespesa = {
      uid: user.uid,
      valor: valorNumerico,
      data,
      categoria,
      descricao: descricao.trim()
    };

    try {
      // Adicionando ao Firestore
      const docRef = await addDoc(collection(db, "despesas"), novaDespesa);

      // Atualiza a lista de despesas na tela imediatamente
      adicionarDespesaNoEstado({ id: docRef.id, ...novaDespesa });

      // Atualiza o saldo após cadastrar a despesa
      setSaldo(saldo - valorNumerico);

      alert("Despesa adicionada com sucesso!");

      // Limpando os campos
      setValor("");
      setData("");
      setCategoria("");
      setDescricao("");

      onClose();
    } catch (error) {
      console.error("Erro ao salvar a despesa:", error);
      alert("Erro ao salvar a despesa.");
    }
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
          style={{ width: "100%", padding: "8px" }}
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
