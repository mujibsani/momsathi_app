import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

/* ---------------- GET USER ---------------- */
const getUser = () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("❌ No authenticated user");
    return null;
  }
  return user;
};

/* ---------------- HISTORY REF ---------------- */
const getUserHistoryRef = () => {
  const user = getUser();
  if (!user) return null;

  return collection(db, "users", user.uid, "history");
};

/* ---------------- ADD HISTORY ---------------- */
export const addHistory = async (item) => {
  try {
    const ref = getUserHistoryRef();
    if (!ref) throw new Error("No user session");

    await addDoc(ref, {
      ...item,
      createdAt: serverTimestamp()
    });

  } catch (err) {
    console.log("❌ addHistory error:", err.message);
  }
};

/* ---------------- DELETE HISTORY ---------------- */
export const deleteHistoryItem = async (id) => {
  try {
    const user = getUser();
    if (!user) throw new Error("No user session");

    const ref = doc(db, "users", user.uid, "history", id);
    await deleteDoc(ref);

  } catch (err) {
    console.log("❌ deleteHistory error:", err.message);
  }
};

/* ---------------- GET ONCE ---------------- */
export const getHistory = async () => {
  try {
    const ref = getUserHistoryRef();
    if (!ref) return [];

    const q = query(ref, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

  } catch (err) {
    console.log("❌ getHistory error:", err.message);
    return [];
  }
};

/* ---------------- REALTIME LISTENER ---------------- */
export const subscribeHistory = (callback) => {
  try {
    const ref = getUserHistoryRef();
    if (!ref) {
      console.log("❌ subscribeHistory: no user");
      return () => {};
    }

    const q = query(ref, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      callback(data);
    });

  } catch (err) {
    console.log("❌ subscribeHistory error:", err.message);
    return () => {};
  }
};