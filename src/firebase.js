// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIutV09SNyaOmMYkOJm6IAvN926fa1rEw",
  authDomain: "scatter-4fd45.firebaseapp.com",
  projectId: "scatter-4fd45",
  storageBucket: "scatter-4fd45.firebasestorage.app",
  messagingSenderId: "319528781999",
  appId: "1:319528781999:web:4cbeac2043b55e6bbb2c5a",
  measurementId: "G-6KKJ15Q2Q7"
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

export { app, analytics, db };
