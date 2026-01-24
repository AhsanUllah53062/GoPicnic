import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5XqBfpHZ68-SSrgDybfdTYG5Zd6Om7rs",
  authDomain: "gopicnic-a258a.firebaseapp.com",
  projectId: "gopicnic-a258a",
  storageBucket: "gopicnic-a258a.appspot.com",
  messagingSenderId: "1046917872262",
  appId: "1:1046917872262:web:b0c11cec6061f7c0c12f07",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
