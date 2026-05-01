import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { calculateWeek } from "../utils/pregnancy";

export const getUserWeek = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return 20;

  const data = snap.data();

  // auto calculate from start date
  if (data.pregnancyStartDate) {
    return calculateWeek(data.pregnancyStartDate);
  }

  return data.pregnancyWeek || 20;
};

export const updateUserWeek = async (uid, week) => {
  await updateDoc(doc(db, "users", uid), {
    pregnancyWeek: week,
    lastUpdated: new Date()
  });
};