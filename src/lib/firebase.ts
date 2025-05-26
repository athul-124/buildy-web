
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

let firebaseConfigIsValid = true;
let missingVars: string[] = [];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(
      `Firebase Configuration Error: Environment variable ${varName} is missing. ` +
      `Please ensure it is correctly set in your .env.local file and that you have ` +
      `restarted your development server after creating/modifying the .env.local file.`
    );
    firebaseConfigIsValid = false;
    missingVars.push(varName);
  }
});

if (!firebaseConfigIsValid) {
  const errorMessage = `Firebase initialization failed due to missing environment variables: ${missingVars.join(', ')}. Please check your .env.local file and restart the server.`;
  console.error(errorMessage);
  // We'll proceed with attempting initialization so Firebase itself can throw
  // its specific error (like auth/invalid-api-key if that's the first one it hits),
  // but this console log provides a more direct hint.
  // Alternatively, we could throw new Error(errorMessage) here to halt execution.
}

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth = null;
let db = null;
let storage = null;

if (firebaseConfigIsValid) { // Only attempt to initialize if config vars seem present
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase SDK initialization failed:", error);
    // This catch block will handle errors from initializeApp itself, like an invalid API key format
    // even if the variable was present.
  }
} else {
    console.error("Firebase SDK will not be initialized due to missing configuration.");
}

// Final check to ensure services are not null if initialization was attempted and supposedly successful
if (firebaseConfigIsValid && (!auth || !db || !storage) && !getApps().length) {
     console.error(
        "Firebase services (Auth, Firestore, Storage) are unexpectedly null after attempted initialization. " +
        "This could indicate an issue with the Firebase config values themselves (e.g., incorrect format) " +
        "even if the environment variables were found."
    );
}


export { app, auth, db, storage };
