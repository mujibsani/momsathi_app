import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";

import {
  getHistory,
  deleteHistoryItem,
  restoreHistoryItem
} from "../services/history";

import { getUrgencyColor } from "../utils/colors";

import {
  analyzeHistory,
  generateInsights
} from "../engine/intelligenceEngine";

import { generateAlerts } from "../engine/alertEngine";
import { generatePredictions } from "../engine/predictionEngine";

import { triggerSmartAlert } from "../engine/notificationEngine";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [undoItem, setUndoItem] = useState(null);

  const timerRef = useRef(null);

  /* ---------------- LOAD ---------------- */
  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data || []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* ---------------- SMART ALERT ---------------- */
  useEffect(() => {
    if (history.length > 0) {
      triggerSmartAlert(history);
    }
  }, [history]);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    const item = history.find((x) => x.id === id);
    if (!item) return;

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
  const groups = useMemo(() => {
    const today = new Date().toLocaleDateString();

    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toLocaleDateString();

    const result = {
      today: [],
      yesterday: [],
      older: []
    };

    (history || []).forEach((item) => {
      if (!item?.date) return;

      if (item.date === today) result.today.push(item);
      else if (item.date === yesterday) result.yesterday.push(item);
      else result.older.push(item);
    });

    return result;
  }, [history]);

  /* ---------------- AI ENGINE ---------------- */
  const analysis = useMemo(() => analyzeHistory(history), [history]);
  const insights = useMemo(() => generateInsights(analysis), [analysis]);
  const alerts = useMemo(() => generateAlerts(history), [history]);
  const predictions = useMemo(() => generatePredictions(history), [history]);

  /* ---------------- ITEM ---------------- */
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
          borderLeftColor: getUrgencyColor(item?.urgency)
        }}
      >
        <Text style={{ fontWeight: "bold" }}>
          {item?.problem}
        </Text>

        <Text style={{ fontSize: 12, color: "#666" }}>
          {item?.date}
        </Text>

        <Text style={{ color: getUrgencyColor(item?.urgency) }}>
          {(item?.urgency || "").toUpperCase()}
        </Text>
      </View>
    </Swipeable>
  );

  /* ---------------- UI ---------------- */
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20, backgroundColor: "#F6F8FF" }}>

        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          📊 Symptom History
        </Text>

        {/* ALERTS */}
        {alerts.length > 0 && (
          <View style={boxAlert}>
            <Text style={title}>🚨 Smart Alerts</Text>
            {alerts.map((a, i) => (
              <Text key={`alert-${i}`}>{a}</Text>
            ))}
          </View>
        )}

        {/* INSIGHTS */}
        {insights.length > 0 && (
          <View style={boxInsight}>
            <Text style={title}>🧠 Insights</Text>
            {insights.map((i, idx) => (
              <Text key={`ins-${idx}`}>{i}</Text>
            ))}
          </View>
        )}

        {/* PREDICTIONS */}
        {predictions.length > 0 && (
          <View style={boxPredict}>
            <Text style={title}>🔮 Predictions</Text>
            {predictions.map((p, i) => (
              <Text key={`pred-${i}`}>{p}</Text>
            ))}
          </View>
        )}

        {/* EMPTY */}
        {history.length === 0 && (
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              🩺 No History Yet
            </Text>
            <Text style={{ marginTop: 8, color: "#666", textAlign: "center" }}>
              Start checking symptoms to build your health timeline
            </Text>
          </View>
        )}

        {/* GROUPS */}
        {groups.today.map(renderItem)}

        {groups.yesterday.map(renderItem)}

        {groups.older.map(renderItem)}

      </ScrollView>

      {/* UNDO */}
      {undoItem && (
        <View style={undoBar}>
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

/* ---------------- STYLES ---------------- */
const boxAlert = {
  marginTop: 15,
  padding: 15,
  backgroundColor: "#FFECEC",
  borderRadius: 12
};

const boxInsight = {
  marginTop: 15,
  padding: 15,
  backgroundColor: "#FFF7E6",
  borderRadius: 12
};

const boxPredict = {
  marginTop: 15,
  padding: 15,
  backgroundColor: "#E8F5E9",
  borderRadius: 12
};

const title = {
  fontWeight: "bold",
  marginBottom: 5
};

const undoBar = {
  position: "absolute",
  bottom: 20,
  left: 20,
  right: 20,
  backgroundColor: "#1f1f1f",
  padding: 14,
  borderRadius: 14,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
};