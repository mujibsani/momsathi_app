import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "symptom_history";

export const useHistoryStore = create((set, get) => ({
  history: [],
  undoItem: null,

  /* LOAD */
  loadHistory: async () => {
    const data = await AsyncStorage.getItem(KEY);
    set({ history: data ? JSON.parse(data) : [] });
  },

  /* ADD */
  addHistory: async (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };

    const updated = [newItem, ...get().history];

    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    set({ history: updated });
  },

  /* DELETE */
  deleteHistory: async (id) => {
    const item = get().history.find((x) => x.id === id);
    const updated = get().history.filter((x) => x.id !== id);

    await AsyncStorage.setItem(KEY, JSON.stringify(updated));

    set({
      history: updated,
      undoItem: item
    });
  },

  /* UNDO */
  undoDelete: async () => {
    const item = get().undoItem;
    if (!item) return;

    const restored = [
      { ...item, id: Date.now().toString() },
      ...get().history
    ];

    await AsyncStorage.setItem(KEY, JSON.stringify(restored));

    set({
      history: restored,
      undoItem: null
    });
  },

  clearUndo: () => set({ undoItem: null })
}));