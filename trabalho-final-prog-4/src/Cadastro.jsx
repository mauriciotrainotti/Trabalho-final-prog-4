import React, { useState } from 'react';
import './Cadastro.css';

function Cadastro({ handleCadastro, handleLoginGoogle, navegarParaLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nome, setNome] = useState('');

  const handleSubmitCadastro = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    // Chama a função de cadastro de usuário que já trata a navegação
    await handleCadastro(email, senha, nome);
  };

  return (
    <div className="content-area">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmitCadastro}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
        />
        <input
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          placeholder="Confirmar Senha"
        />
        <button type="submit">Cadastrar</button>
      </form>

      <button type="button" onClick={handleLoginGoogle}>Cadastrar com Google</button>

      <p>
        Já possui cadastro? <button onClick={navegarParaLogin}>Fazer login</button>
      </p>
    </div>
  );
}

export default Cadastro;
