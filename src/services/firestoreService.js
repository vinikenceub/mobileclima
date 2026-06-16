import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Platform } from 'react-native';
import { db } from '../../firebaseConfig';

export function getUserDocRef(userId) {
  return doc(db, 'users', userId);
}

export async function fetchUserProfile(userId) {
  const userRef = getUserDocRef(userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
}

export async function createUserProfile(userId, profile) {
  const userRef = getUserDocRef(userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, profile);
  }
}

export function subscribeToUserProfile(userId, callback) {
  if (Platform.OS === 'web') {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchUserProfile(userId);
        if (!cancelled) {
          // #region agent log
          fetch('http://127.0.0.1:7806/ingest/6e5c8b9d-a7cc-4efc-9860-f2c4b561787a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7fd7c6'},body:JSON.stringify({sessionId:'7fd7c6',runId:'post-fix',hypothesisId:'A',location:'firestoreService.js:webGetDoc',message:'Web profile loaded via getDoc',data:{userId,hasData:!!data},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
          callback(data);
        }
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7806/ingest/6e5c8b9d-a7cc-4efc-9860-f2c4b561787a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7fd7c6'},body:JSON.stringify({sessionId:'7fd7c6',runId:'post-fix',hypothesisId:'A',location:'firestoreService.js:webGetDoc',message:'Web getDoc failed',data:{code:error?.code,message:error?.message},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        if (!cancelled) {
          callback(null);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      // #region agent log
      fetch('http://127.0.0.1:7806/ingest/6e5c8b9d-a7cc-4efc-9860-f2c4b561787a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7fd7c6'},body:JSON.stringify({sessionId:'7fd7c6',runId:'post-fix',hypothesisId:'A',location:'firestoreService.js:webCleanup',message:'Web profile cleanup (no Listen channel)',data:{userId},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    };
  }

  const userRef = getUserDocRef(userId);

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        callback(null);
      }
    },
    (error) => {
      // #region agent log
      fetch('http://127.0.0.1:7806/ingest/6e5c8b9d-a7cc-4efc-9860-f2c4b561787a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7fd7c6'},body:JSON.stringify({sessionId:'7fd7c6',runId:'post-fix',hypothesisId:'A',location:'firestoreService.js:onSnapshot',message:'Firestore listener error',data:{code:error?.code,message:error?.message},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      callback(null);
    },
  );
}

export async function updateUserDisplayName(userId, displayName) {
  const userRef = getUserDocRef(userId);
  await updateDoc(userRef, { displayName });
}

export async function updateUserFavorites(userId, favorites) {
  const userRef = getUserDocRef(userId);
  await updateDoc(userRef, { favorites });
}
