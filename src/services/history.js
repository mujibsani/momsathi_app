import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "symptom_history";

/* ---------------- GET ---------------- */
export const getHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("GET ERROR:", e);
    return [];
  }
};

/* ---------------- SAVE ---------------- */
export const saveHistory = async (item) => {
  try {
    const data = await getHistory();

    const newItem = {
      ...item,
      id: Date.now().toString()
    };

    const updated = [newItem, ...data];

    await AsyncStorage.setItem(KEY, JSON.stringify(updated));

    return updated;
  } catch (e) {
    console.log("SAVE ERROR:", e);
    return [];
  }
};

/* ---------------- DELETE ---------------- */
export const deleteHistoryItem = async (id) => {
  try {
    const data = await getHistory();

    const updated = data.filter((item) => item.id !== id);

    await AsyncStorage.setItem(KEY, JSON.stringify(updated));

    return updated;
  } catch (e) {
    console.log("DELETE ERROR:", e);
    return [];
  }
};

/* ---------------- RESTORE (UNDO) ---------------- */
export const restoreHistoryItem = async (item) => {
  try {
    const data = await getHistory();

    const restored = [
      { ...item, id: Date.now().toString() },
      ...data
    ];

    await AsyncStorage.setItem(KEY, JSON.stringify(restored));

    return restored;
  } catch (e) {
    console.log("RESTORE ERROR:", e);
    return [];
  }
};