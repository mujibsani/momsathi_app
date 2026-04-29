import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

/* ---------------- GET USER ID ---------------- */
const getUserId = () => {
  return auth.currentUser?.uid;
};

/* ---------------- COLLECTION REFERENCE ---------------- */
const getUserHistoryRef = () => {
  const uid = getUserId();
  if (!uid) return null;

  return collection(db, "users", uid, "history");
};

/* ---------------- ADD HISTORY ---------------- */
export const addHistory = async (item) => {
  const ref = getUserHistoryRef();
  if (!ref) return;

  await addDoc(ref, {
    ...item,
    createdAt: Date.now()
  });
};

/* ---------------- DELETE HISTORY ---------------- */
export const deleteHistoryItem = async (id) => {
  const uid = getUserId();
  if (!uid) return;

  const ref = doc(db, "users", uid, "history", id);
  await deleteDoc(ref);
};

/* ---------------- GET ONCE ---------------- */
export const getHistory = async () => {
  const ref = getUserHistoryRef();
  if (!ref) return [];

  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
};

/* ---------------- REAL-TIME LISTENER ---------------- */
export const subscribeHistory = (callback) => {
  const ref = getUserHistoryRef();
  if (!ref) return () => {};

  const q = query(ref, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    callback(data);
  });
};