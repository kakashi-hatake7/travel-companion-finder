// Firebase Configuration
// 
// INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project called "TravelBuddy"
// 3. Go to Build → Authentication → Get Started
// 4. Enable "Email/Password" sign-in method
// 5. Go to Build → Firestore Database → Create database
// 6. Go to Project Settings → Your apps → Add web app
// 7. Copy your config values below

import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCMbzZiyY2VcQ45ftpFe--W3K3i5mnfeBo",
    authDomain: "travelbuddy-cbf8a.firebaseapp.com",
    projectId: "travelbuddy-cbf8a",
    storageBucket: "travelbuddy-cbf8a.firebasestorage.app",
    messagingSenderId: "391974735963",
    appId: "1:391974735963:web:7e79d836c56c1e01a9af7e",
    measurementId: "G-ZD35Z8NRCH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

const analytics = getAnalytics(app);

export default app;

