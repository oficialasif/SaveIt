// Firebase configuration for SaveIt Extension
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyATPFNMGb3hkcYDtrDGoRwL4hhA188ZObQ",
  authDomain: "saveit-26.firebaseapp.com",
  projectId: "saveit-26",
  storageBucket: "saveit-26.firebasestorage.app",
  messagingSenderId: "897770808257",
  appId: "1:897770808257:web:77cfa11fe33b460f71c540",
  measurementId: "G-K9MNR0Z791"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('✅ Firebase initialized in extension');

// Export for use in other scripts
export { db, doc, getDoc };
