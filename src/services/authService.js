import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { createUserProfile } from './firestoreService';

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function loginWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function registerWithEmail(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  await createUserProfile(credential.user.uid, {
    displayName: displayName || '',
    email,
    favorites: [],
  });

  return credential.user;
}

export async function logout() {
  await signOut(auth);
}
