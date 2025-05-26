
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { UserDocument, UserRole } from '@/types';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  type AuthError
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: FirebaseUser | null;
  userDoc: UserDocument | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (name: string, email: string, pass: string, phone: string, role: UserRole, address?: string) => Promise<void>;
  logIn: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("AuthContext: Setting up auth state listener");
    let unsubscribe = () => {};
    
    try {
      // Check if auth is properly initialized
      if (!auth) {
        throw new Error('Firebase auth is not initialized');
      }
      
      // Set up the auth state listener
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log("AuthContext: Auth state changed", { 
          isAuthenticated: !!firebaseUser,
          userId: firebaseUser?.uid
        });
        
        setUser(firebaseUser);
        
        if (firebaseUser) {
          try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              const userData = userSnap.data() as UserDocument;
              console.log("AuthContext: User document found", { 
                role: userData.role,
                name: userData.name
              });
              setUserDoc(userData);
              setRole(userData.role);
            } else {
              // This case might happen if user exists in Auth but not Firestore
              console.warn("User document not found in Firestore for UID:", firebaseUser.uid);
              setUserDoc(null);
              setRole(null);
              
              // Attempt to fetch user document again after a short delay
              // This helps in cases where Firestore might be lagging
              setTimeout(async () => {
                try {
                  const retryUserSnap = await getDoc(userRef);
                  if (retryUserSnap.exists()) {
                    const userData = retryUserSnap.data() as UserDocument;
                    console.log("AuthContext: User document found on retry", { 
                      role: userData.role,
                      name: userData.name
                    });
                    setUserDoc(userData);
                    setRole(userData.role);
                  }
                } catch (retryError) {
                  console.error("Error on retry fetching user document:", retryError);
                }
              }, 1000);
            }
          } catch (error) {
            console.error("Error fetching user document:", error);
            setUserDoc(null);
            setRole(null);
          }
        } else {
          console.log("AuthContext: User is not authenticated");
          setUserDoc(null);
          setRole(null);
        }
        
        setLoading(false);
      });
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      setLoading(false);
    }

    // Clean up the auth state listener when the component unmounts
    return () => {
      console.log("AuthContext: Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const signUp = async (name: string, email: string, pass: string, phone: string, selectedRole: UserRole, address?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;

    const newUserDoc: UserDocument = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name,
      phone,
      role: selectedRole,
      createdAt: serverTimestamp() as Timestamp, // Will be converted to Timestamp by Firestore
      ...(selectedRole === 'customer' && address && { address }),
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), newUserDoc);

    if (selectedRole === 'expert') {
      // Create a basic profile in 'experts' collection
      await setDoc(doc(db, 'experts', firebaseUser.uid), {
        uid: firebaseUser.uid,
        displayName: name, // Default to user's name, expert can change later
        specialties: [],
        servicesOffered: [],
        projectPhotos: [],
        createdAt: serverTimestamp(),
      });
    }
    setUser(firebaseUser);
    setUserDoc(newUserDoc);
    setRole(selectedRole);
  };

  const logIn = async (email: string, pass: string) => {
    console.log("AuthContext: Attempting login");
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;
    
    console.log("AuthContext: Login successful, user authenticated");
    
    // Optimistically set user
    setUser(firebaseUser);
    
    // Immediately fetch user document instead of waiting for auth state change
    // This helps ensure we have the user data as soon as possible
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserDocument;
        console.log("AuthContext logIn: User document found", { 
          role: userData.role,
          name: userData.name
        });
        setUserDoc(userData);
        setRole(userData.role);
      } else {
        console.warn("AuthContext logIn: User document not found in Firestore for UID:", firebaseUser.uid);
        setUserDoc(null);
        setRole(null);
        
        // Attempt to fetch user document again after a short delay
        setTimeout(async () => {
          try {
            const retryUserSnap = await getDoc(userRef);
            if (retryUserSnap.exists()) {
              const userData = retryUserSnap.data() as UserDocument;
              console.log("AuthContext logIn: User document found on retry", { 
                role: userData.role,
                name: userData.name
              });
              setUserDoc(userData);
              setRole(userData.role);
            }
          } catch (retryError) {
            console.error("AuthContext logIn: Error on retry fetching user document:", retryError);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("AuthContext logIn: Error fetching user document:", error);
      setUserDoc(null);
      setRole(null);
    }
    
    // Auth state change will also trigger useEffect to fetch userDoc and role as a backup
    return firebaseUser; // Return the user in case the caller needs it
  };

  const logOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserDoc(null);
    setRole(null);
    router.push('/'); // Redirect to home after logout
  };
  
  const value = { user, userDoc, role, loading, signUp, logIn, logOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
