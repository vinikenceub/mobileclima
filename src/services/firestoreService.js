import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export function getUserDocRef(userId) {
  return doc(db, 'users', userId);
}

export async function createUserProfile(userId, profile) {
  const userRef = getUserDocRef(userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, profile);
  }
}

export function subscribeToUserProfile(userId, callback) {
  const userRef = getUserDocRef(userId);
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(null);
    }
  });
}

export async function updateUserDisplayName(userId, displayName) {
  const userRef = getUserDocRef(userId);
  await updateDoc(userRef, { displayName });
}

export async function updateUserFavorites(userId, favorites) {
  const userRef = getUserDocRef(userId);
  await updateDoc(userRef, { favorites });
}
