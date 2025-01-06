// src/services/firebaseConfig.js

// Importa os SDKs necessários
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Banco de dados Firestore
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Autenticação e Provedor Google

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAyEb7qjA5zy6uXy9Yru4KETlzo9LJc7VQ",
  authDomain: "trabalho-final-prog-4.firebaseapp.com",
  projectId: "trabalho-final-prog-4",
  storageBucket: "trabalho-final-prog-4.appspot.com", // Corrigido
  messagingSenderId: "1079548600469",
  appId: "1:1079548600469:web:8363f7a2e9facd832ebb9c",
  measurementId: "G-RX2YY4SERC",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que você irá usar
const db = getFirestore(app); // Firestore 
const auth = getAuth(app); // Autenticação
const googleProvider = new GoogleAuthProvider(); // Provedor Google

export { app, db, auth, googleProvider };
