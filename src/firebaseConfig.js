// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBLDOK6C9XcPpN9m72kzQ1QkhGcKzxLGwo",
  authDomain: "shareat-239a1.firebaseapp.com",
  projectId: "shareat-239a1",
  storageBucket: "shareat-239a1.appspot.com",
  messagingSenderId: "948547259662",
  appId: "1:948547259662:web:da333889ebba389b645b5f",
  measurementId: "G-W4WHNQ9JSR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
