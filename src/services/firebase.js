import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6Qf6mqG9Q8OiBp1GrRsKWt9DiMpNvMPs",
  authDomain: "momshathi-app.firebaseapp.com",
  projectId: "momshathi-app",
  storageBucket: "momshathi-app.firebasestorage.app",
  messagingSenderId: "428155288879",
  appId: "1:428155288879:web:2d46a8bc92deaf94a075da"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);