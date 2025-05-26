
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// IMPORTANT: Hardcoded Firebase configuration
// This is a temporary solution since environment variables aren't loading properly
// In production, you should use environment variables instead
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyA7N4xP5RRTU0-_y2gFNkpadZgnthp4YvI',
  authDomain: 'thrissur-home-joy.firebaseapp.com',
  projectId: 'thrissur-home-joy',
  storageBucket: 'thrissur-home-joy.firebasestorage.app',
  messagingSenderId: '799012190425',
  appId: '1:799012190425:web:952c786c4005f2a593a6c8',
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  // Initialize Firebase with hardcoded config
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log("Firebase initialized successfully!");
} catch (error) {
  console.error("Firebase SDK initialization failed:", error);
  
  // Create fallback objects to prevent null reference errors
  const createErrorThrower = (service) => {
    return new Proxy({}, {
      get: function(target, prop) {
        if (typeof prop === 'string') {
          return () => { 
            throw new Error(`Firebase ${service} not initialized. Check your Firebase configuration.`);
          };
        }
        return undefined;
      }
    });
  };
  
  // Provide fallback objects that throw helpful errors when used
  auth = createErrorThrower('Auth');
  db = createErrorThrower('Firestore');
  storage = createErrorThrower('Storage');
}


export { app, auth, db, storage };
