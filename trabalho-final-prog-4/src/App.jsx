import { useState, useEffect } from 'react';
import { db, auth, googleProvider } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Importando o  de navegação
import './App.css';
import Cadastro from './Cadastro';
import TelaInicial from './TelaInicial';
import Login from './Login';

function App() {
  const [currentScreen, setCurrentScreen] = useState('cadastro');
  const [modalAdicionarSaldoAberto, setModalAdicionarSaldoAberto] = useState(false);
  const [saldo, setSaldo] = useState(0); // Começa como 0 para evitar erros

  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Usando o hook de navegação
  
  useEffect(() => {
    if (user) {
      const carregarDadosUsuario = async () => {
        try {
          const userDocRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setSaldo(userData.saldo); // Atualiza o saldo com o valor salvo no Firestore
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      };

      carregarDadosUsuario();
    }
  }, [user]);

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
        await setDoc(userDocRef, {
          uid: user.uid,
          nome: user.displayName || '',
          email: user.email,
          fotoUrl: user.photoURL || '',
          criadoEm: new Date().toISOString(),
          saldo: 0 
        });
        alert("Conta Google registrada com sucesso!");
      }
      
      setUser({ uid: user.uid, ...docSnap.data() });
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
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        setUser({ uid: user.uid, ...docSnap.data() });
      } else {
        console.log('Usuário não encontrado no Firestore.');
      }
  
      navegarPara('TelaInicial');
    } catch (error) {
      console.error('Erro ao autenticar com email:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };
  
  const atualizarSaldo = async (novoSaldo) => {
    if (user) {
      const userDocRef = doc(db, 'usuarios', user.uid);
      try {
        await updateDoc(userDocRef, { saldo: novoSaldo });
        setSaldo(novoSaldo);
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
          handleLoginGoogle={handleLoginGoogle}
          navegarParaLogin={() => navegarPara('login')}
        />
      )}

      {currentScreen === 'login' && (
        <Login
          handleLoginGoogle={handleLoginGoogle}
          handleLoginEmail={handleLoginEmail}
        />
      )}
    </div>
  );
}

export default App;
