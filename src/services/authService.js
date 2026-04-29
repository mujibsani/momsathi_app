import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth } from "./firebase";

/* ---------------- REGISTER ---------------- */
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    console.log("REGISTER ERROR:", error.code, error.message);
    throw error;
  }
};

/* ---------------- LOGIN ---------------- */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
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