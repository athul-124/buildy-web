
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data() as UserDocument;
            setUserDoc(userData);
            setRole(userData.role);
          } else {
            // This case might happen if user exists in Auth but not Firestore
            // Potentially log them out or prompt to complete profile
            console.warn("User document not found in Firestore for UID:", firebaseUser.uid);
            setUserDoc(null);
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setUserDoc(null);
          setRole(null);
        }
      } else {
        setUserDoc(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;
    // Auth state change will trigger useEffect to fetch userDoc and role
    setUser(firebaseUser); // Optimistically set user, useEffect will handle the rest
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
