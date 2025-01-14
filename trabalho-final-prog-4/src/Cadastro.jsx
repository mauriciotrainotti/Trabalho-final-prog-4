import React, { useState } from "react";
import "./Cadastro.css";

function Cadastro({ handleCadastro, handleLoginGoogle, navegarParaLogin }) {
  if (!handleCadastro) {
    console.error("Erro: handleCadastro não foi passado corretamente como prop.");
  }

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nome, setNome] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const handleSubmitCadastro = async (e) => {
    e.preventDefault();
    setMensagemErro(""); // Limpa mensagens de erro anteriores

    if (senha !== confirmarSenha) {
      setMensagemErro("As senhas não coincidem!");
      return;
    }

    try {
      const sucesso = await handleCadastro(email, senha, nome);
      console.log("Resultado de handleCadastro:", sucesso);
      
      if (sucesso) {
        setMensagemSucesso("Usuário cadastrado com sucesso! Redirecionando...");
        setTimeout(() => {
          navegarParaLogin();
        }, 2000);
      } else {
        setMensagemErro("Erro ao cadastrar usuário. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no handleSubmitCadastro:", error);
      setMensagemErro("Erro inesperado ao cadastrar.");
    }
  };

  const handleCadastroGoogle = async () => {
    try {
      const sucesso = await handleLoginGoogle();
      if (sucesso) {
        setMensagemSucesso("Cadastro realizado com sucesso via Google! Redirecionando...");
        setTimeout(() => {
          navegarParaLogin();
        }, 2000);
      } else {
        setMensagemErro("Erro ao cadastrar com Google. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar com Google:", error);
      setMensagemErro("Erro inesperado ao cadastrar com Google.");
    }
  };

  return (
    <div className="content-area">
      <h2>Cadastro</h2>
      {mensagemSucesso && <p className="mensagem-sucesso">{mensagemSucesso}</p>}
      {mensagemErro && <p className="mensagem-erro">{mensagemErro}</p>}

      <form onSubmit={handleSubmitCadastro}>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" required />
        <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Confirmar Senha" required />
        <button className="botao-cadastrar" type="submit">Cadastrar</button>
      </form>

      <button className="botao-google" type="button" onClick={handleCadastroGoogle}>
        Cadastrar com Google
      </button>

      <p>
        Já possui cadastro? <button className="botao-login" onClick={navegarParaLogin}>Fazer login</button>
      </p>
    </div>
  );
}

export default Cadastro;
