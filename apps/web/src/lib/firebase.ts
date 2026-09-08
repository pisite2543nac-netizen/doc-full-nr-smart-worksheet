import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { generatedFirebaseConfig } from '../generated/firebaseConfig';

const env = import.meta.env;
const cfg = {
  apiKey: env.VITE_FIREBASE_API_KEY || generatedFirebaseConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || generatedFirebaseConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || generatedFirebaseConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || generatedFirebaseConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || generatedFirebaseConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || generatedFirebaseConfig.appId
};

const forcedDemo = env.VITE_DEMO_MODE === 'true';
export const demoMode = forcedDemo || !cfg.apiKey || cfg.projectId !== 'doc-full-nr';
export const app = demoMode ? null : (getApps()[0] ?? initializeApp(cfg));
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const functions = app ? getFunctions(app, 'asia-southeast1') : null;
export const firebaseProjectId = cfg.projectId;
