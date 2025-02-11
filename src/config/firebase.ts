// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm1XLN7NrefTnOTGZuHOWD0qhr7t8WYlA",
  authDomain: "my-final-project-6247e.firebaseapp.com",
  projectId: "my-final-project-6247e",
  storageBucket: "my-final-project-6247e.firebasestorage.app",
  messagingSenderId: "330347614263",
  appId: "1:330347614263:web:18cc3031e2e2f8114a6fb2",
  measurementId: "G-MTW56ZLZQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();