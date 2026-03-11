// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
apiKey: "AIzaSyB3yfQYAz3mB61cQrud-ZuE1G3KOYKle8w",
  authDomain: "internship-recommender.firebaseapp.com",
  projectId: "internship-recommender",
  storageBucket: "internship-recommender.firebasestorage.app",
  messagingSenderId: "1005053355916",
  appId: "1:1005053355916:web:d1a52b512733758826d8a9",
  measurementId: "G-CZXEH5157X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 