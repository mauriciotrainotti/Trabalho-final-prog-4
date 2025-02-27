import React, { useState } from 'react';
import './Login.css';

function Login({ handleLoginEmail, handleLoginGoogle }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState(''); // Estado para a mensagem de erro

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const erro = await handleLoginEmail(email, senha);
    if (erro) {
      setMensagemErro(erro); // Define a mensagem de erro vinda do Firebase
    }
  };

  return (
    <div className="content-area">
      <h2>Login</h2>

      {mensagemErro && <p className="mensagem-erro">{mensagemErro}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" className="submit-button">Entrar</button>
      </form>
      <button onClick={handleLoginGoogle} className="google-login-button">
        Login com Google
      </button>
    </div>
  );
}

export default Login;
