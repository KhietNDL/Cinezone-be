// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb4llxp_2-WkwC_H4ljODgXss3BRVp058",
  authDomain: "cinezone-26327.firebaseapp.com",
  projectId: "cinezone-26327",
  storageBucket: "cinezone-26327.firebasestorage.app",
  messagingSenderId: "1046952846911",
  appId: "1:1046952846911:web:42fcf7f297be10b18bfa8a",
  measurementId: "G-CH398EWY0W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth();
