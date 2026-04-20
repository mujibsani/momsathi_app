import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "symptom_history";

/* SAVE HISTORY */
export const saveHistory = async (item) => {
  try {
    const existing = await AsyncStorage.getItem(KEY);
    const data = existing ? JSON.parse(existing) : [];

    data.unshift(item); // latest first

    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.log("Save history error:", e);
  }
};

/* GET HISTORY */
export const getHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("Load history error:", e);
    return [];
  }
};