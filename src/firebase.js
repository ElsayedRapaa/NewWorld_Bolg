// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-wRAqSOJpweCbKb0BnQfJNirIt7F_vpU",
  authDomain: "newworld-d569e.firebaseapp.com",
  projectId: "newworld-d569e",
  storageBucket: "newworld-d569e.appspot.com",
  messagingSenderId: "688568558177",
  appId: "1:688568558177:web:fb4109cd2a3931100d0020",
  measurementId: "G-LQ3E4FJE7J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const database = getFirestore(app);
export const storage = getStorage(app);
