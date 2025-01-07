import { useState, useEffect } from 'react';
import { db, auth, googleProvider } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc, setDoc, updateDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Importando o hook de navegação
import './App.css';
import Cadastro from './Cadastro';
import TelaInicial from './TelaInicial';
import Login from './Login';

function App() {
  const [currentScreen, setCurrentScreen] = useState('cadastro');
  const [modalAdicionarSaldoAberto, setModalAdicionarSaldoAberto] = useState(false);
  const [saldo, setSaldo] = useState(500);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Usando o hook de navegação
  

  // Função para alternar entre as telas
  const navegarPara = (tela) => setCurrentScreen(tela);

  // Função para login com Google
  const handleLoginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Se o usuário não existir no Firestore, cadastramos
        await setDoc(userDocRef, {
          uid: user.uid,
          nome: user.displayName || '',
          email: user.email,
          fotoUrl: user.photoURL || '',
          criadoEm: new Date().toISOString(),
          saldo: 0 // Definindo saldo inicial como 0
        });
        alert("Conta Google registrada com sucesso!"); // Mensagem de sucesso
      }
console.log(docSnap.data())
      // Define o usuário e redireciona para a tela inicial
      setUser(docSnap.data());
      navegarPara('TelaInicial');
    } catch (error) {
      console.error('Erro ao autenticar com Google:', error);
      alert('Erro ao fazer login com Google');
    }
  };

  const handleLoginEmail = async (email, senha) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      const userDocRef = doc(db, 'usuarios', user.uid);
      const doc = await getDoc(userDocRef);
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        setUser(docSnap.data())
        console.log('Document data:', doc.data());
      }
     


      navegarPara('TelaInicial'); // Redireciona para a Tela Inicial
      return null; // Sem erro, retorna null
    } catch (error) {
      console.error('Erro ao autenticar com email:', error);
      
      // Mapeia os códigos de erro do Firebase para mensagens amigáveis
      if (error.code === 'auth/user-not-found') {
        return 'Usuário não encontrado. Verifique o e-mail digitado.';
      } else if (error.code === 'auth/wrong-password') {
        return 'Senha incorreta. Tente novamente.';
      } else if (error.code === 'auth/invalid-email') {
        return 'Formato de e-mail inválido.';
      } else {  
        return 'Erro ao fazer login. Tente novamente mais tarde.';
      }
    }
  };

  const handleCadastro = async (email, senha, nome) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      const objlegal = {
        uid: user.uid,
        nome: nome || '',
        email: user.email,
        criadoEm: new Date().toISOString(),
        saldo: 0 // Definindo saldo inicial como 0
      }
      const userDocRef = doc(db, 'usuarios', user.uid);
      await setDoc(userDocRef, objlegal);
  
      setUser(objlegal); // Atualiza o estado do usuário
      alert('Usuário cadastrado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navegarPara('login'); // Agora a navegação funciona corretamente
      }, 2000); // Aguarda 2 segundos antes de redirecionar
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Este email já está cadastrado. Tente outro.');
      } else {
        console.error('Erro ao cadastrar usuário no Firestore:', error);
      }
    }
  };

  // Função para atualizar o saldo
  const atualizarSaldo = async (novoSaldo) => {
    if (user) { // Verificar se o usuário está logado
      const userDocRef = doc(db, 'usuarios', user.uid);
      try {
        await updateDoc(userDocRef, {
          saldo: novoSaldo
        });
        setSaldo(novoSaldo); // Atualiza o estado local após a atualização no Firestore
        console.log('Saldo atualizado no Firestore para:', novoSaldo);
      } catch (error) {
        console.error('Erro ao atualizar saldo no Firestore:', error);
      }
    } else {
      console.error('Nenhum usuário logado, não é possível atualizar o saldo.');
    }
  };

  return (
    <div className="App">
      {currentScreen === 'TelaInicial' && (
        <TelaInicial 
          saldo={saldo} 
          setModalAdicionarSaldoAberto={setModalAdicionarSaldoAberto} 
          modalAdicionarSaldoAberto={modalAdicionarSaldoAberto}
          user={user}
          onSaldoAlterado={atualizarSaldo}
        />
      )}

      {currentScreen === 'cadastro' && (
        <Cadastro
          handleCadastro={handleCadastro}
          handleLoginGoogle={handleLoginGoogle}
          voltarParaHome={() => navegarPara('TelaInicial')}
          navegarParaLogin={() => navegarPara('login')}
        />
      )}

      {currentScreen === 'login' && (
        <Login
          handleLoginGoogle={handleLoginGoogle}
          handleLoginEmail={handleLoginEmail} // Passando a função de login com email
        />
      )}
    </div>
  );
}

export default App;