import React, { useState } from 'react';

function ModalAdicionarSaldo({ isOpen, onClose, onSaldoAlterado, saldo }) {
  const [novoSaldo, setNovoSaldo] = useState(saldo);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaldoAlterado(novoSaldo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Saldo</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            value={novoSaldo} 
            onChange={(e) => setNovoSaldo(parseFloat(e.target.value) || 0)} 
            placeholder="Novo Saldo"
          />
          <button type="submit">Confirmar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

export default ModalAdicionarSaldo;