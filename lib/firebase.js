// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBu4BJkyTV3bV070dL2VSYUsQjpeFvXwPc",
  authDomain: "todo-c80ee.firebaseapp.com",
  projectId: "todo-c80ee",
  storageBucket: "todo-c80ee.firebasestorage.app",
  messagingSenderId: "16752979778",
  appId: "1:16752979778:web:5274d024f2b9847fae62db",
  measurementId: "G-KLK296ZP90"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
