import { create } from "zustand";
import {
  getHistory,
  saveHistory,
  deleteHistoryItem,
  restoreHistoryItem
} from "../services/history";

export const useAppStore = create((set, get) => ({
  history: [],
  undoItem: null,

  /* ---------------- LOAD ---------------- */
  loadHistory: async () => {
    const data = await getHistory();
    set({ history: data || [] });
  },

  /* ---------------- ADD ---------------- */
  addHistory: async (item) => {
    const updated = await saveHistory(item);
    set({ history: updated });
  },

  /* ---------------- DELETE ---------------- */
  deleteItem: async (id) => {
    const current = get().history;
    const item = current.find((x) => x.id === id);

    const updated = await deleteHistoryItem(id);

    set({
      history: updated,
      undoItem: item
    });
  },

  /* ---------------- UNDO ---------------- */
  undoDelete: async () => {
    const item = get().undoItem;
    if (!item) return;

    const updated = await restoreHistoryItem(item);

    set({
      history: updated,
      undoItem: null
    });
  },

  /* ---------------- CLEAR UNDO ---------------- */
  clearUndo: () => set({ undoItem: null })
}));