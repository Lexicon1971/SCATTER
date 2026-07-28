// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Supports environment variables (REACT_APP_, EXPO_PUBLIC_, or direct) with robust default fallbacks.
const env = typeof process !== 'undefined' ? process.env : (globalThis.process?.env || {});

const firebaseConfig = {
  apiKey: env.REACT_APP_FIREBASE_API_KEY || env.EXPO_PUBLIC_FIREBASE_API_KEY || env.FIREBASE_API_KEY || "AIzaSyAIutV09SNyaOmMYkOJm6IAvN926fa1rEw",
  authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN || env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN || "scatter-4fd45.firebaseapp.com",
  projectId: env.REACT_APP_FIREBASE_PROJECT_ID || env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID || "scatter-4fd45",
  storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET || env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET || "scatter-4fd45.firebasestorage.app",
  messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID || "319528781999",
  appId: env.REACT_APP_FIREBASE_APP_ID || env.EXPO_PUBLIC_FIREBASE_APP_ID || env.FIREBASE_APP_ID || "1:319528781999:web:4cbeac2043b55e6bbb2c5a",
  measurementId: env.REACT_APP_FIREBASE_MEASUREMENT_ID || env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || env.FIREBASE_MEASUREMENT_ID || "G-6KKJ15Q2Q7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally to prevent errors in non-browser environments
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {});

// Initialize Firestore with offline multi-tab persistence enabled
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize and export Firebase Auth
const auth = getAuth(app);

export { app, analytics, db, auth };
