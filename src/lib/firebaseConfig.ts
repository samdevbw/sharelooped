import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Determine the environment (Vite or CRA)
const isVite = typeof import.meta.env !== 'undefined';

// Firebase configuration
const firebaseConfig = {
  apiKey: isVite ? import.meta.env.VITE_FIREBASE_API_KEY : process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: isVite ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN : process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: isVite ? import.meta.env.VITE_FIREBASE_PROJECT_ID : process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: isVite ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET : process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: isVite ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID : process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: isVite ? import.meta.env.VITE_FIREBASE_APP_ID : process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: isVite ? import.meta.env.VITE_FIREBASE_MEASUREMENT_ID : process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };