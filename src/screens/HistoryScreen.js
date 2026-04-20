import React, { useState, useCallback, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";

import {
  getHistory,
  deleteHistoryItem,
  restoreHistoryItem
} from "../services/history";

import { getUrgencyColor } from "../utils/colors";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [undoItem, setUndoItem] = useState(null);

  const timerRef = useRef(null);

  /* ---------------- LOAD ---------------- */
  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data || []);
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    const item = history.find((x) => x.id === id);

    const updated = await deleteHistoryItem(id);
    setHistory(updated);

    setUndoItem(item);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setUndoItem(null);
    }, 5000);
  };

  /* ---------------- UNDO ---------------- */
  const handleUndo = async () => {
    if (!undoItem) return;

    const updated = await restoreHistoryItem(undoItem);
    setHistory(updated);

    setUndoItem(null);
  };

  /* ---------------- GROUP HISTORY ---------------- */
  const groupHistory = () => {
    const today = new Date().toLocaleDateString();

    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toLocaleDateString();

    const groups = {
      today: [],
      yesterday: [],
      older: []
    };

    history.forEach((item) => {
      if (item.date === today) groups.today.push(item);
      else if (item.date === yesterday) groups.yesterday.push(item);
      else groups.older.push(item);
    });

    return groups;
  };

  const groups = groupHistory();

  /* ---------------- ITEM UI ---------------- */
  const renderItem = (item) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={{
            backgroundColor: "#E53935",
            justifyContent: "center",
            alignItems: "flex-end",
            padding: 20,
            marginTop: 10,
            borderRadius: 12
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Delete
          </Text>
        </TouchableOpacity>
      )}
    >
      <View
        style={{
          marginTop: 10,
          padding: 15,
          backgroundColor: "white",
          borderRadius: 12,
          borderLeftWidth: 5,
          borderLeftColor: getUrgencyColor(item.urgency)
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{item.problem}</Text>
        <Text style={{ fontSize: 12, color: "#666" }}>{item.date}</Text>
        <Text style={{ color: getUrgencyColor(item.urgency) }}>
          {item.urgency.toUpperCase()}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={{ flex: 1 }}>

      <ScrollView style={{ padding: 20, backgroundColor: "#F6F8FF" }}>

        {/* TITLE */}
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          📊 Symptom History
        </Text>

        {/* EMPTY STATE */}
        {history.length === 0 && (
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              🩺 No History Yet
            </Text>

            <Text style={{ marginTop: 8, color: "#666", textAlign: "center" }}>
              Start checking symptoms to build your health timeline
            </Text>

            <Text style={{ marginTop: 15, fontSize: 30 }}>
              📊
            </Text>
          </View>
        )}

        {/* TODAY */}
        {groups.today.length > 0 && (
          <>
            <Text style={{ marginTop: 20, fontWeight: "bold" }}>
              🟢 Today
            </Text>
            {groups.today.map((item) => (
              <View key={item.id}>{renderItem(item)}</View>
            ))}
          </>
        )}

        {/* YESTERDAY */}
        {groups.yesterday.length > 0 && (
          <>
            <Text style={{ marginTop: 20, fontWeight: "bold" }}>
              🟡 Yesterday
            </Text>
            {groups.yesterday.map((item) => (
              <View key={item.id}>{renderItem(item)}</View>
            ))}
          </>
        )}

        {/* OLDER */}
        {groups.older.length > 0 && (
          <>
            <Text style={{ marginTop: 20, fontWeight: "bold" }}>
              🔵 Older
            </Text>
            {groups.older.map((item) => (
              <View key={item.id}>{renderItem(item)}</View>
            ))}
          </>
        )}

      </ScrollView>

      {/* UNDO BAR */}
      {undoItem && (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: "#1f1f1f",
            padding: 14,
            borderRadius: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            elevation: 8
          }}
        >
          <Text style={{ color: "white" }}>
            Deleted {undoItem.problem}
          </Text>

          <TouchableOpacity onPress={handleUndo}>
            <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
              UNDO
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}