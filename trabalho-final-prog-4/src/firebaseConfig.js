// src/services/firebaseConfig.js

// Importa os SDKs necessários
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Banco de dados Firestore
import { getAnalytics } from "firebase/analytics"; // Analytics (opcional)
import { getAuth } from "firebase/auth"; // Autenticação (se necessário)

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAyEb7qjA5zy6uXy9Yru4KETlzo9LJc7VQ",
  authDomain: "trabalho-final-prog-4.firebaseapp.com",
  projectId: "trabalho-final-prog-4",
  storageBucket: "trabalho-final-prog-4.firebasestorage.app",
  messagingSenderId: "1079548600469",
  appId: "1:1079548600469:web:8363f7a2e9facd832ebb9c",
  measurementId: "G-RX2YY4SERC"
};
 
// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que você irá usar
const analytics = getAnalytics(app); // Opcional
const db = getFirestore(app); // Firestore (banco de dados)
const auth = getAuth(app); // Autenticação (se necessário)

export { app, analytics, db, auth };
