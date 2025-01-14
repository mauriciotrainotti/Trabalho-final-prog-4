import React, { useState, useEffect } from "react";
import ModalAdicionarSaldo from "./ModalAdicionarSaldo";
import ModalAdicionarDespesa from "./ModalAdicionarDespesa";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./TelaInicial.css";

function TelaInicial({ saldo, setModalAdicionarSaldoAberto, modalAdicionarSaldoAberto, user, onSaldoAlterado }) {
  const [modalDespesaAberto, setModalDespesaAberto] = useState(false);
  const [despesas, setDespesas] = useState([]);

  // Função para carregar as despesas do Firestore
  useEffect(() => {
    const carregarDespesas = async () => {
      if (!user) return;

      try {
        const despesasRef = collection(db, "despesas");
        const q = query(despesasRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const despesasCarregadas = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDespesas(despesasCarregadas);
      } catch (error) {
        console.error("Erro ao buscar despesas:", error);
      }
    };

    carregarDespesas();
  }, [user]); // Atualiza quando o usuário loga

  // Adicionar nova despesa ao estado local
  const adicionarDespesaNoEstado = (novaDespesa) => {
    setDespesas((prevDespesas) => [...prevDespesas, novaDespesa]);
  };

  return (
    <div>
      <header className="header">
        <div className="balance-section">
          <span className="balance">Saldo Atual: R$ {saldo.toFixed(2)}</span>
          <button
            className="add-balance-button"
            onClick={() => setModalAdicionarSaldoAberto(true)}
          >
            + Adicionar Saldo
          </button>
        </div>
      </header>

      <div className="content-area">
        {user ? (
          <div className="user-info">
            <span className="ola-user">Olá, {user.nome}!</span>
            <br />
            <br />
            <button 
              className="add-expense-button"
              onClick={() => setModalDespesaAberto(true)}
            >
              + Adicionar Despesa
            </button>
          </div>
        ) : (
          <div className="not-logged-in">
            <span>Você não está logado.</span>
            <button onClick={() => alert("Você precisa estar logado.")}>
              Ir para Cadastro
            </button>
          </div>
        )}
      </div>

      {/* LISTAGEM DAS DESPESAS */}
      <div className="despesas-lista">
        <h3>Despesas</h3>
        {despesas.length === 0 ? (
          <p>Nenhuma despesa cadastrada.</p>
        ) : (
          <ul>
            {despesas.map((despesa, index) => (
              <li key={index} className="despesa-item">
                <strong>{despesa.descricao}</strong>
                <p>Data: {new Date(despesa.data).toLocaleDateString()}</p>
                <p>Valor: R$ {despesa.valor.toFixed(2)}</p>
                <p>Categoria: {despesa.categoria}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modais */}
      <ModalAdicionarSaldo 
        isOpen={modalAdicionarSaldoAberto} 
        onClose={() => setModalAdicionarSaldoAberto(false)}
        onSaldoAlterado={onSaldoAlterado}
        saldo={saldo}
      />

      <ModalAdicionarDespesa 
        isOpen={modalDespesaAberto}
        onClose={() => setModalDespesaAberto(false)}
        user={user}
        saldo={saldo}
        setSaldo={onSaldoAlterado}
        adicionarDespesaNoEstado={adicionarDespesaNoEstado}
      />
    </div>
  );
}

export default TelaInicial;
