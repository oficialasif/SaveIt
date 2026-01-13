import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyATPFNMGb3hkcYDtrDGoRwL4hhA188ZObQ",
    authDomain: "saveit-26.firebaseapp.com",
    projectId: "saveit-26",
    storageBucket: "saveit-26.firebasestorage.app",
    messagingSenderId: "897770808257",
    appId: "1:897770808257:web:77cfa11fe33b460f71c540",
    measurementId: "G-K9MNR0Z791"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
