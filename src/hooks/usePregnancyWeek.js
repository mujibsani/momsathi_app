import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";

export const usePregnancyWeek = () => {
  const [week, setWeek] = useState(null);

  useEffect(() => {
    const load = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const snap = await getDoc(doc(db, "users", uid));
      const data = snap.data();

      if (!data) return;

      if (data.pregnancyStartDate) {
        const start = new Date(data.pregnancyStartDate);
        const now = new Date();

        const diffWeeks = Math.floor(
          (now - start) / (7 * 24 * 60 * 60 * 1000)
        );

        setWeek(Math.max(1, diffWeeks));
      } else {
        setWeek(data.pregnancyWeek || 20);
      }
    };

    load();
  }, []);

  return week;
};