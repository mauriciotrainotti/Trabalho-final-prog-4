import React, { useState } from 'react';
import ModalAdicionarSaldo from './ModalAdicionarSaldo'; 
import ModalAdicionarDespesa from "./ModalAdicionarDespesa";
import './TelaInicial.css';

function TelaInicial({ saldo, setModalAdicionarSaldoAberto, modalAdicionarSaldoAberto, user, onSaldoAlterado }) {
  const [modalDespesaAberto, setModalDespesaAberto] = useState(false);

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
            {console.log(user)}
<br />
<br />
            {/* Botão para abrir o modal de adicionar despesa */}
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

      {/* Modal de adicionar saldo */}
      <ModalAdicionarSaldo 
        isOpen={modalAdicionarSaldoAberto} 
        onClose={() => setModalAdicionarSaldoAberto(false)}
        onSaldoAlterado={onSaldoAlterado}
        saldo={saldo}
      />

      {/* Modal de adicionar despesa */}
      <ModalAdicionarDespesa 
        isOpen={modalDespesaAberto}
        onClose={() => setModalDespesaAberto(false)}
        user={user}
        saldo={saldo}
        setSaldo={onSaldoAlterado} // Atualiza o saldo após adicionar despesa
      />
    </div>
  );
}

export default TelaInicial;
