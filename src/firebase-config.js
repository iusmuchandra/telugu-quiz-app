// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add your web app's Firebase configuration
// Replace this with the firebaseConfig object you copied from the website
const firebaseConfig = {
  apiKey: "AIzaSyBlCg0HNm-T1hbOnogdiN_K52-J7Z8fEoE",
  authDomain: "telugu-quiz-app-5bad3.firebaseapp.com",
  projectId: "telugu-quiz-app-5bad3",
  storageBucket: "telugu-quiz-app-5bad3.firebasestorage.app",
  messagingSenderId: "471065939987",
  appId: "1:471065939987:web:4298ac8a8ff85a7916afe6",
  measurementId: "G-TM4GQZFJJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the firestore database instance
export const db = getFirestore(app);
