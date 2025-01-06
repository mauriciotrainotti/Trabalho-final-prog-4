import { useState, useEffect } from 'react';
import { db, auth, googleProvider } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
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

  // Função de login com Google
  const handleLoginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          nome: user.displayName || '',
          email: user.email,
          fotoUrl: user.photoURL || '',
          criadoEm: new Date().toISOString(),
        });
      }

      setUser(user);
      navigate('/TelaInicial'); // Navega para a tela inicial após o login
    } catch (error) {
      console.error('Erro ao autenticar com Google:', error);
    }
  };

  // Função de login com email e senha
  const handleLoginEmail = async (email, senha) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      setUser(user);
      navigate('/TelaInicial'); // Navega para a tela inicial após o login
    } catch (error) {
      console.error('Erro ao autenticar com email:', error);
    }
  };

  // Função de cadastro de usuário
  const handleCadastro = async (email, senha, nome) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      const userDocRef = doc(db, 'usuarios', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        nome: nome || '',
        email: user.email,
        criadoEm: new Date().toISOString(),
      });

      setUser(user); // Atualiza o estado do usuário
      navigate('/login'); // Redireciona para a tela de login após o cadastro
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Este email já está cadastrado. Tente outro.');
      } else {
        console.error('Erro ao cadastrar usuário no Firestore:', error);
      }
    }
  };

  return (
    <div className="App">
      {currentScreen === 'TelaInicial' && (
        <TelaInicial saldo={saldo} setModalAdicionarSaldoAberto={setModalAdicionarSaldoAberto} user={user} />
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
