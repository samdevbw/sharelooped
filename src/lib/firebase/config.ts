import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { env } from './env';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_73RihJUu7KdQVutFVEs8Z5Cyq4VFXe8",
  authDomain: "share-looped-v1.firebaseapp.com",
  projectId: "share-looped-v1",
  storageBucket: "share-looped-v1.appspot.com",
  messagingSenderId: "267893394746",
  appId: "1:267893394746:web:d9f9dd5fbe3ddae781d403",
  measurementId: "G-RX9W0CDMBW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Optional: Connect to emulators in development
if (env.ENVIRONMENT === 'development') {
  import('firebase/auth').then(({ connectAuthEmulator }) => {
    connectAuthEmulator(auth, "http://localhost:9099");
  });
  
  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    connectFirestoreEmulator(db, 'localhost', 8080);
  });
}

export { auth, db };