import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// #region agent log
fetch('http://127.0.0.1:7806/ingest/6e5c8b9d-a7cc-4efc-9860-f2c4b561787a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7fd7c6'},body:JSON.stringify({sessionId:'7fd7c6',runId:'post-fix-v2',hypothesisId:'C',location:'firebaseConfig.js:init',message:'Firestore singleton init',data:{appCount:getApps().length},timestamp:Date.now()})}).catch(()=>{});
// #endregion
