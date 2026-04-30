import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth } from "./firebase";
import { createUserProfile } from "./userService"; // ✅ ADD THIS

/* ---------------- REGISTER ---------------- */
export const registerUser = async (email, password) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      cleanPassword
    );

    const user = userCredential.user;

    // 🔥 CREATE FIRESTORE USER PROFILE (IMPORTANT)
    await createUserProfile(user);

    return user;
  } catch (error) {
    console.log("REGISTER ERROR:", error.code, error.message);
    throw error;
  }
};

/* ---------------- LOGIN ---------------- */
export const loginUser = async (email, password) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const userCredential = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      cleanPassword
    );

    return userCredential.user;
  } catch (error) {
    console.log("LOGIN ERROR:", error.code, error.message);
    throw error;
  }
};

/* ---------------- LOGOUT ---------------- */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
    throw error;
  }
};