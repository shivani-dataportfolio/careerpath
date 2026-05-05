import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdE7Te_HoEUSY4ysM7Qz_5VL-6-Pa-KCA",
  authDomain: "ai-career-f355f.firebaseapp.com",
  projectId: "ai-career-f355f",
  storageBucket: "ai-career-f355f.firebasestorage.app",
  messagingSenderId: "590424372223",
  appId: "1:590424372223:web:c3074cf124ba79c6646dca",
  measurementId: "G-B2WNT2YGDH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;


