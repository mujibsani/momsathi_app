import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";

import { auth } from "./firebase";
import { createUserProfile } from "./userService";

/* ---------------- REGISTER ---------------- */
export const registerUser = async (email, password, extraData = {}) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 🔐 CREATE AUTH USER
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      cleanPassword
    );

    const user = userCredential.user;

    // 📩 SEND EMAIL VERIFICATION
    await sendEmailVerification(user);

    // 🔥 CREATE FIRESTORE PROFILE
    await createUserProfile(user, {
      fullName: extraData.fullName || "",
      age: extraData.age || null,
      country: extraData.country || "",

      pregnancyStartDate: extraData.pregnancyStartDate || null,
      pregnancyWeek: extraData.pregnancyWeek || null,

      isManualWeekMode: extraData.isManualWeekMode ?? true
    });

    return user;
  } catch (error) {
    console.log("REGISTER ERROR:", error.code, error.message);

    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use");
    }
    if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("Password must be at least 6 characters");
    }

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

    const user = userCredential.user;

    // 🚫 BLOCK IF NOT VERIFIED
    if (!user.emailVerified) {
      throw new Error("Please verify your email before logging in.");
    }

    return user;
  } catch (error) {
    console.log("LOGIN ERROR:", error.code, error.message);

    if (error.code === "auth/user-not-found") {
      throw new Error("User not found");
    }
    if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password");
    }

    throw error;
  }
};

/* ---------------- RESEND VERIFICATION ---------------- */
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No logged-in user");
    }

    await sendEmailVerification(user);

    return true;
  } catch (error) {
    console.log("RESEND EMAIL ERROR:", error.code, error.message);
    throw error;
  }
};

/* ---------------- CHECK VERIFICATION ---------------- */
export const checkEmailVerified = async () => {
  try {
    const user = auth.currentUser;

    if (!user) return false;

    // 🔄 refresh user state
    await user.reload();

    return user.emailVerified;
  } catch (error) {
    console.log("CHECK VERIFY ERROR:", error);
    return false;
  }
};

/* ---------------- RESET PASSWORD ---------------- */
export const resetPassword = async (email) => {
  try {
    const cleanEmail = email.trim().toLowerCase();

    await sendPasswordResetEmail(auth, cleanEmail);

    return true;
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error.code, error.message);

    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email");
    }

    throw error;
  }
};

/* ---------------- LOGOUT ---------------- */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("LOGOUT ERROR:", error.code, error.message);
    throw error;
  }
};