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

// Firebase config loaded from environment variables (.env.local)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

const analytics = getAnalytics(app);

export default app;

