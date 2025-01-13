import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

function Despesas({ user, adicionarDespesaNoEstado }) {
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    if (user) {
      const carregarDespesas = async () => {
        const despesasRef = collection(db, "despesas");
        const querySnapshot = await getDocs(despesasRef);
        const despesasList = [];
        querySnapshot.forEach((doc) => {
          despesasList.push({ id: doc.id, ...doc.data() });
        });
        setDespesas(despesasList);
      };

      carregarDespesas();
    }
  }, [user]);

  return (
    <div>
      {despesas.map((despesa) => (
        <div key={despesa.id}>
          <p>{despesa.descricao} - R$ {despesa.valor}</p>
        </div>
      ))}
    </div>
  );
}

export default Despesas;
