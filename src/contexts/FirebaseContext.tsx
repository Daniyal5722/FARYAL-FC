import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface FirebaseContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const getIdToken = useCallback(async (forceRefresh = false): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try {
      const idToken = await auth.currentUser.getIdToken(forceRefresh);
      setToken(idToken);
      return idToken;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    // Listen to real-time auth and token state changes
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const currentToken = await currentUser.getIdToken();
          setToken(currentToken);

          // Sync user profile to Firestore
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: 'member',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }

          // Check if admin
          const isBootstrappedAdmin = currentUser.email === 'mdaniyalhayyat@gmail.com';
          let hasAdminDoc = false;
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            hasAdminDoc = adminDoc.exists();
          } catch {
            // Ignore error checking admin collection
          }
          setIsAdmin(isBootstrappedAdmin || hasAdminDoc);
        } catch (err) {
          console.warn('Error during user profile sync:', err);
          setIsAdmin(currentUser.email === 'mdaniyalhayyat@gmail.com');
        }
      } else {
        setToken(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, token, loading, isAdmin, getIdToken }}>
      {loading ? (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Loading Faryal FC...</p>
        </div>
      ) : (
        children
      )}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
