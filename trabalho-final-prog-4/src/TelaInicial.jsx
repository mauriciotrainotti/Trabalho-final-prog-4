import React from 'react';

function TelaInicial({ saldo, setModalAdicionarSaldoAberto, user }) {
  return (
    <div>
      <header className="header">
        <button className="menu-button">☰ Menu</button>
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
    <span className="ola-user">Olá, {user.displayName || 'Usuário'}!</span>
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
    </div>
  );
}

export default TelaInicial;
