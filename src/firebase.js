// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbf4MAtqjIzxx4i7YqKJEJ_FsPA_sQOO4",
  authDomain: "performance-management-8a444.firebaseapp.com",
  projectId: "performance-management-8a444",
  storageBucket: "performance-management-8a444.appspot.com",
  messagingSenderId: "814196915682",
  appId: "1:814196915682:web:50ae84119e6c3f28c28dbb",
}; // Replace with your own Firebase config

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db };
export default auth;
