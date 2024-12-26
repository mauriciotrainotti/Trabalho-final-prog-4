import { useState, useEffect } from "react";
import { db, app } from "./firebaseConfig.js"; // Importa o Firebase App e Firestore
import { collection, getDocs } from "firebase/firestore"; // Funções Firestore
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Configuração do Firebase</h1>
      <p>Firebase App Name: {app.name}</p> {/* Verifica se o Firebase foi inicializado */}
    </div>
  );
}

export default App;
