import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/* ---------------- CREATE USER PROFILE ---------------- */
export const createUserProfile = async (user) => {
  if (!user?.uid) return;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email?.trim().toLowerCase(),
    pregnancyWeek: 20, // default starting value
    createdAt: serverTimestamp(),

    // optional future AI fields
    riskLevel: "low",
    lastUpdated: serverTimestamp()
  });
};