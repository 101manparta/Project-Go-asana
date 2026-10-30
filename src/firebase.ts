import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';

// Use project configuration
// Supported environment variables with reliable fallbacks
const firebaseConfig = {
  projectId: 'asana-project-dec10',
  authDomain: 'asana-project-dec10.firebaseapp.com',
  storageBucket: 'asana-project-dec10.appspot.com',
  apiKey: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_API_KEY) || 
          (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_API_KEY) || 
          'AIzaSyB_mock_live_fallback_key',
  appId: '1:502980407892:web:asana-yoga-live'
};

let app: FirebaseApp;
let auth: Auth;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (err) {
  console.warn('Firebase initialization notice:', err);
  // Re-try default
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig, 'asana-yoga-app');
  auth = getAuth(app);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };

// Real Firebase Auth Functions
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    return res.user;
  } catch (error: any) {
    console.error('Email Login Error:', error);
    throw error;
  }
}

export async function registerWithEmail(email: string, pass: string, displayName: string) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName && res.user) {
      await updateProfile(res.user, { displayName });
    }
    return res.user;
  } catch (error: any) {
    console.error('Registration Error:', error);
    throw error;
  }
}

export async function logOutFirebase() {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
