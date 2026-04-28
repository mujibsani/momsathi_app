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

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#F6F8FF",
  card: "#FFFFFF",
  alert: "#FFECEC",
  insight: "#FFF7E6",
  predict: "#E8F5E9",
  primary: "#2D3A8C",
  text: "#222",
  subtext: "#666"
};

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [undoItem, setUndoItem] = useState(null);

  const timerRef = useRef(null);
  const lastAlertRef = useRef(null);

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

  /* ---------------- FIXED SMART ALERT SYSTEM ---------------- */
  useEffect(() => {
    const runSmartAlert = async () => {
      try {
        if (!history || history.length === 0) return;

        // unique key to avoid duplicate notifications
        const key = history.length + "_" + history[0]?.date;

        if (lastAlertRef.current === key) return;

        lastAlertRef.current = key;

        // ✅ IMPORTANT: pass FULL history (correct input)
        await triggerSmartAlert(history);

      } catch (e) {
        console.log("Smart alert error:", e);
      }
    };

    runSmartAlert();
  }, [history]);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    const item = history.find((x) => x.id === id);
    if (!item) return;

    const updated = await deleteHistoryItem(id);
    setHistory(updated);

    setUndoItem(item);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setUndoItem(null), 5000);
  };

  /* ---------------- UNDO ---------------- */
  const handleUndo = async () => {
    if (!undoItem) return;

    const updated = await restoreHistoryItem(undoItem);
    setHistory(updated);
    setUndoItem(null);
  };

  /* ---------------- GROUP ---------------- */
  const groups = useMemo(() => {
    const today = new Date().toLocaleDateString();

    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toLocaleDateString();

    const result = { today: [], yesterday: [], older: [] };

    (history || []).forEach((item) => {
      if (!item?.date) return;

      if (item.date === today) result.today.push(item);
      else if (item.date === yesterday) result.yesterday.push(item);
      else result.older.push(item);
    });

    return result;
  }, [history]);

  /* ---------------- AI ---------------- */
  const analysis = useMemo(() => analyzeHistory(history), [history]);
  const insights = useMemo(() => generateInsights(analysis), [analysis]);
  const alerts = useMemo(() => generateAlerts(history), [history]);
  const predictions = useMemo(() => generatePredictions(history), [history]);

  /* ---------------- CARD ---------------- */
  const Card = ({ children, bg = COLORS.card }) => (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 16,
        padding: 16,
        marginTop: 15,
        elevation: 3
      }}
    >
      {children}
    </View>
  );

  /* ---------------- ITEM ---------------- */
  const renderItem = (item) => (
    <Swipeable
      key={item.id}
      renderRightActions={() => (
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={{
            backgroundColor: "#E53935",
            justifyContent: "center",
            paddingHorizontal: 20,
            borderRadius: 16,
            marginTop: 10
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Delete
          </Text>
        </TouchableOpacity>
      )}
    >
      <Card>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {item.problem}
        </Text>

        <Text style={{ color: COLORS.subtext, marginTop: 4 }}>
          {item.date}
        </Text>

        <Text
          style={{
            marginTop: 6,
            color: getUrgencyColor(item.urgency),
            fontWeight: "bold"
          }}
        >
          {(item.urgency || "").toUpperCase()}
        </Text>
      </Card>
    </Swipeable>
  );

  /* ---------------- UI ---------------- */
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView style={{ padding: 20 }}>

        {/* HEADER */}
        <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.text }}>
          📊 Symptom History
        </Text>

        {/* ALERTS */}
        {alerts.length > 0 && (
          <Card bg={COLORS.alert}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              🚨 Smart Alerts
            </Text>
            {alerts.map((a, i) => (
              <Text key={i} style={{ marginTop: 6 }}>
                • {a}
              </Text>
            ))}
          </Card>
        )}

        {/* INSIGHTS */}
        {insights.length > 0 && (
          <Card bg={COLORS.insight}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              🧠 Insights
            </Text>
            {insights.map((i, idx) => (
              <Text key={idx} style={{ marginTop: 6 }}>
                • {i}
              </Text>
            ))}
          </Card>
        )}

        {/* PREDICTIONS */}
        {predictions.length > 0 && (
          <Card bg={COLORS.predict}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              🔮 Predictions
            </Text>
            {predictions.map((p, i) => (
              <Text key={i} style={{ marginTop: 6 }}>
                • {p}
              </Text>
            ))}
          </Card>
        )}

        {/* EMPTY */}
        {history.length === 0 && (
          <Card>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              🩺 No history yet
            </Text>
          </Card>
        )}

        {/* GROUPS */}
        {groups.today.length > 0 && (
          <>
            <Text style={sectionTitle}>🟢 Today</Text>
            {groups.today.map(renderItem)}
          </>
        )}

        {groups.yesterday.length > 0 && (
          <>
            <Text style={sectionTitle}>🟡 Yesterday</Text>
            {groups.yesterday.map(renderItem)}
          </>
        )}

        {groups.older.length > 0 && (
          <>
            <Text style={sectionTitle}>🔵 Older</Text>
            {groups.older.map(renderItem)}
          </>
        )}

      </ScrollView>

      {/* UNDO BAR */}
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

const sectionTitle = {
  marginTop: 20,
  fontWeight: "bold",
  fontSize: 14,
  color: "#444"
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