import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import './App.css';

function App() {
  // States para controlar a visibilidade dos modais
  const [modalAdicionarSaldoAberto, setModalAdicionarSaldoAberto] = useState(false);
  const [modalAdicionarDespesaAberto, setModalAdicionarDespesaAberto] = useState(false);

  // States para o saldo e o valor do novo saldo
  const [saldo, setSaldo] = useState(500);  // Valor inicial
  const [novoSaldo, setNovoSaldo] = useState('');

  // State para armazenar as despesas
  const [despesas, setDespesas] = useState([]);

  // State para a despesa em adição
  const [despesa, setDespesa] = useState({
    valor: '',
    categoria: '',
    data: '',
    titulo: ''
  });

  // Função para obter o saldo do Firebase (se houver)
  useEffect(() => {
    const obterSaldo = async () => {
      const docRef = doc(db, 'usuarios', 'saldo'); // Certifique-se de que o nome do documento seja correto
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSaldo(docSnap.data().valor); // Atualiza o saldo com o valor vindo do Firebase
      } else {
        console.log("No such document!");
      }
    };

    obterSaldo();
  }, []);

  // Função para abrir o modal de adicionar saldo
  const abrirModalAdicionarSaldo = () => {
    setModalAdicionarSaldoAberto(true);
  };

  // Função para fechar o modal de adicionar saldo
  const fecharModalAdicionarSaldo = () => {
    setModalAdicionarSaldoAberto(false);
  };

  // Função para atualizar o saldo no Firebase
  const atualizarSaldo = async () => {
    const novoSaldoValue = parseFloat(novoSaldo);
    if (!isNaN(novoSaldoValue)) {
      setSaldo(novoSaldoValue); // Atualiza o estado com o novo saldo
      const docRef = doc(db, 'usuarios', 'saldo'); // Certifique-se de que o nome do documento seja correto
      await setDoc(docRef, { valor: novoSaldoValue }); // Atualiza o saldo no Firebase
      setModalAdicionarSaldoAberto(false); // Fecha o modal
      setNovoSaldo(''); // Limpa o campo de input
    }
  };

  // Função para abrir o modal de adicionar despesa
  const abrirModalAdicionarDespesa = () => {
    setModalAdicionarDespesaAberto(true);
  };

  // Função para fechar o modal de adicionar despesa
  const fecharModalAdicionarDespesa = () => {
    setModalAdicionarDespesaAberto(false);
  };

  // Função para lidar com as mudanças nos inputs de despesa
  const handleMudancaInput = (e) => {
    const { name, value } = e.target;
    setDespesa({ ...despesa, [name]: value });
  };

  // Função para enviar a despesa e salvar no Firebase
  const handleEnviarDespesa = async (e) => {
    e.preventDefault();
    
    const valorDespesa = parseFloat(despesa.valor);
    if (!isNaN(valorDespesa)) {
      // Adiciona a nova despesa ao estado de despesas
      const novaDespesa = {
        ...despesa,
        valor: valorDespesa,
      };
      
      setDespesas([...despesas, novaDespesa]);

      // Atualiza o saldo subtraindo a despesa
      const saldoAtualizado = saldo - valorDespesa;
      setSaldo(saldoAtualizado);

      // Atualiza o saldo no Firebase
      const docRef = doc(db, 'usuarios', 'saldo'); 
      await updateDoc(docRef, { valor: saldoAtualizado });

      // Adiciona a despesa na coleção "despesas" do Firebase
      const despesasRef = collection(db, 'despesas');
      await addDoc(despesasRef, novaDespesa); // Adiciona a despesa no Firestore

      // Fecha o modal após salvar a despesa
      fecharModalAdicionarDespesa();
      setDespesa({ valor: '', categoria: '', data: '', titulo: '' }); // Limpa os campos de despesa
    }
  };

  return (
    <div className="App">
      <header className="header">
        <button className="menu-button">☰ Menu</button>
        <div className="balance-section">
          <span className="balance">Saldo Atual: R$ {saldo.toFixed(2)}</span>
          <button className="add-balance-button" onClick={abrirModalAdicionarSaldo}>
            + Adicionar Saldo
          </button>
        </div>
      </header>

      <div className="content-area">
        <div className="user-info">
          <span className="greeting">Olá, João!</span>
        </div>
        

        <div className="expense-info">
          <span className="monthly-expense">Despesa mensal: R$ {despesas.reduce((total, despesa) => total + despesa.valor, 0).toFixed(2)}</span>
          <button className="add-expense-button" onClick={abrirModalAdicionarDespesa}>
            Adicionar despesa
          </button>
        </div>
      </div>

      {/* Listagem de Despesas fora da content-area */}
      <div className="despesas-list">
        <h3>Despesas:</h3>
        {despesas.map((despesa, index) => (
          <div key={index} className="despesa-item">
            <span>{despesa.titulo} - R$ {despesa.valor.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Modal de Adicionar Saldo */}
      {modalAdicionarSaldoAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Adicionar Saldo</h2>
            <form onSubmit={e => { e.preventDefault(); atualizarSaldo(); }}>
              <div className="modal-field">
                <label>Valor</label>
                <input
                  type="number"
                  placeholder="Digite o valor"
                  value={novoSaldo}
                  onChange={(e) => setNovoSaldo(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="modal-submit-button">
                Salvar Saldo
              </button>
            </form>

            <button className="modal-close-button" onClick={fecharModalAdicionarSaldo}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Despesa */}
      {modalAdicionarDespesaAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Adicionar Despesa</h2>
            <form onSubmit={handleEnviarDespesa}>
              <div className="modal-field">
                <label>Valor</label>
                <input
                  type="number"
                  name="valor"
                  value={despesa.valor}
                  onChange={handleMudancaInput}
                  placeholder="Digite o valor"
                  required
                />
              </div>

              <div className="modal-field">
                <label>Categoria</label>
                <select
                  name="categoria"
                  value={despesa.categoria}
                  onChange={handleMudancaInput}
                  required
                >
                  <option value="">Selecione a categoria</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Assinaturas e serviços">Assinaturas e serviços</option>
                  <option value="Bares e restaurantes">Bares e restaurantes</option>
                  <option value="Casa">Casa</option>
                  <option value="Compras">Compras</option>
                  <option value="Cuidados pessoais">Cuidados pessoais</option>
                  <option value="Dívidas e empréstimos">Dívidas e empréstimos</option>
                  <option value="Educação">Educação</option>
                  <option value="Família e filhos">Família e filhos</option>
                  <option value="Impostos e Taxas">Impostos e Taxas</option>
                  <option value="Investimentos">Investimentos</option>
                  <option value="Lazer e hobbies">Lazer e hobbies</option>
                  <option value="Mercado">Mercado</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="modal-field">
                <label>Data</label>
                <input
                  type="date"
                  name="data"
                  value={despesa.data}
                  onChange={handleMudancaInput}
                  required
                />
              </div>

              <div className="modal-field">
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={despesa.titulo}
                  onChange={handleMudancaInput}
                  placeholder="Digite o título da despesa"
                  required
                />
              </div>

              <button type="submit" className="modal-submit-button">Salvar despesa</button>
            </form>

            <button className="modal-close-button" onClick={fecharModalAdicionarDespesa}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
