import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/* ---------------- CREATE USER PROFILE ---------------- */
export const createUserProfile = async (user, extraData = {}) => {
  if (!user?.uid) return;

  await setDoc(doc(db, "users", user.uid), {
    /* ---------------- BASIC PROFILE ---------------- */
    email: user.email?.trim().toLowerCase(),
    fullName: extraData.fullName || "",
    age: extraData.age || null,
    country: extraData.country || "",

    /* ---------------- PREGNANCY SYSTEM ---------------- */
    pregnancyStartDate: extraData.pregnancyStartDate || null,
    pregnancyWeek: extraData.pregnancyWeek || null,

    isManualWeekMode: extraData.isManualWeekMode ?? true,

    /* ---------------- AI META ---------------- */
    riskLevel: "low",

    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
};