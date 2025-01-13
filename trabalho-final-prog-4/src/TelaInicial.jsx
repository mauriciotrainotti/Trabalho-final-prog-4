import React, { useState } from 'react';
import ModalAdicionarSaldo from './ModalAdicionarSaldo'; 
import ModalAdicionarDespesa from "./ModalAdicionarDespesa";
import './TelaInicial.css';

function TelaInicial({ saldo, setModalAdicionarSaldoAberto, modalAdicionarSaldoAberto, user, onSaldoAlterado }) {
  const [modalDespesaAberto, setModalDespesaAberto] = useState(false);
  const [despesas, setDespesas] = useState([]); // Estado para armazenar despesas

  // Função para adicionar nova despesa na lista
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
                <strong>{despesa.descricao}</strong> {/* Agora exibe a descrição corretamente */}
                <p>Data: {despesa.data}</p>
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
        adicionarDespesaNoEstado={adicionarDespesaNoEstado} // Passando a função para o modal
      />
    </div>
  );
}

export default TelaInicial;
