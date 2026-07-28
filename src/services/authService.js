import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../firebase";

/**
 * Registers a new user with email and password.
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The authenticated user object
 */
export async function registerWithEmailAndPassword(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
}

/**
 * Logs in an existing user with email and password.
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The authenticated user object
 */
export async function loginWithEmailAndPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user: ", error);
    throw error;
  }
}

/**
 * Logs out the currently authenticated user.
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out user: ", error);
    throw error;
  }
}

/**
 * Attaches a listener to track user authentication state changes.
 * @param {Function} callback - Callback function that receives the current user object
 * @returns {Function} An unsubscribe function to detach the listener
 */
export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Sends a password reset email to the specified address.
 * @param {string} email - The user's email address
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    throw error;
  }
}

export { auth };
