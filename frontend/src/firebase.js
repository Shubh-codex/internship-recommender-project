import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyB3yfQYAz3mB61cQrud-ZuE1G3KOYKle8w",
  authDomain: "internship-recommender.firebaseapp.com",
  projectId: "internship-recommender",
  storageBucket: "internship-recommender.firebasestorage.app",
  messagingSenderId: "1005053355916",
  appId: "1:1005053355916:web:d1a52b512733758826d8a9",
  measurementId: "G-CZXEH5157X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
