// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);