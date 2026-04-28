import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";

import { getHistory } from "../services/history";
import {
  analyzeHistory,
  generateInsights
} from "../engine/intelligenceEngine";
import { generatePredictions } from "../engine/predictionEngine";

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#F6F8FF",
  card: "#FFFFFF",
  insight: "#FFF7E6",
  predict: "#E8F5E9",
  primary: "#2D3A8C",
  text: "#222",
  sub: "#666"
};

export default function WeeklyReportScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getHistory();
    setHistory(data || []);
  };

  /* ---------------- LAST 7 DAYS ---------------- */
  const weekly = useMemo(() => {
    const now = new Date();

    return (history || []).filter((item) => {
      if (!item?.date) return false;

      const parsed = new Date(item.date);
      if (isNaN(parsed)) return false;

      const diff =
        (now - parsed) / (1000 * 60 * 60 * 24);

      return diff <= 7;
    });
  }, [history]);

  /* ---------------- STATS ---------------- */
  const total = weekly.length;

  const high = weekly.filter(
    (i) => i.urgency === "high"
  ).length;

  const score =
    total === 0 ? 100 : Math.max(100 - high * 20, 30);

  /* ---------------- AI ---------------- */
  const analysis = useMemo(
    () => analyzeHistory(weekly),
    [weekly]
  );

  const insights = useMemo(
    () => generateInsights(analysis),
    [analysis]
  );

  const predictions = useMemo(
    () => generatePredictions(weekly),
    [weekly]
  );

  /* ---------------- AI SUMMARY ---------------- */
  const summary = useMemo(() => {
    if (total === 0) return "No symptoms recorded this week.";

    if (high === 0)
      return "Your week looks stable. No high-risk symptoms detected.";

    if (high <= 2)
      return "Some moderate risk detected. Monitor your symptoms carefully.";

    return "Multiple high-risk signals detected. Consider medical consultation.";
  }, [total, high]);

  /* ---------------- CARD ---------------- */
  const Card = ({ children, bg = COLORS.card }) => (
    <View
      style={{
        backgroundColor: bg,
        padding: 16,
        borderRadius: 16,
        marginTop: 15,
        elevation: 3
      }}
    >
      {children}
    </View>
  );

  /* ---------------- UI ---------------- */
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg, padding: 20 }}>

      {/* HEADER */}
      <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.text }}>
        📅 Weekly Report
      </Text>

      {/* AI SUMMARY */}
      <Card>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          🧠 AI Summary
        </Text>

        <Text style={{ marginTop: 8, color: COLORS.sub }}>
          {summary}
        </Text>
      </Card>

      {/* STATS GRID */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Card style={{ flex: 1 }}>
          <Text style={title}>Score</Text>
          <Text style={value}>{score}</Text>
        </Card>

        <Card style={{ flex: 1 }}>
          <Text style={title}>Total</Text>
          <Text style={value}>{total}</Text>
        </Card>

        <Card style={{ flex: 1 }}>
          <Text style={title}>High</Text>
          <Text style={value}>{high}</Text>
        </Card>
      </View>

      {/* INSIGHTS */}
      {insights.length > 0 && (
        <Card bg={COLORS.insight}>
          <Text style={header}>🧠 Insights</Text>

          {insights.map((item, i) => (
            <Text key={i} style={{ marginTop: 6 }}>
              • {item}
            </Text>
          ))}
        </Card>
      )}

      {/* PREDICTIONS */}
      {predictions.length > 0 && (
        <Card bg={COLORS.predict}>
          <Text style={header}>🔮 Predictions</Text>

          {predictions.map((item, i) => (
            <Text key={i} style={{ marginTop: 6 }}>
              • {item}
            </Text>
          ))}
        </Card>
      )}

      {/* TIMELINE */}
      <Card>
        <Text style={header}>📊 Weekly Timeline</Text>

        {weekly.length === 0 && (
          <Text style={{ marginTop: 8, color: COLORS.sub }}>
            No activity this week
          </Text>
        )}

        {weekly.map((item) => (
          <View
            key={item.id}
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 12,
              backgroundColor: "#F1F3FF"
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {item.problem}
            </Text>

            <Text style={{ color: COLORS.sub }}>
              {item.date}
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontWeight: "bold",
                color:
                  item.urgency === "high"
                    ? "#E53935"
                    : item.urgency === "medium"
                    ? "#FB8C00"
                    : "#43A047"
              }}
            >
              {(item.urgency || "").toUpperCase()}
            </Text>
          </View>
        ))}
      </Card>

    </ScrollView>
  );
}

/* ---------------- TEXT STYLES ---------------- */

const title = {
  fontSize: 12,
  color: "#666"
};

const value = {
  fontSize: 20,
  fontWeight: "bold",
  marginTop: 4
};

const header = {
  fontWeight: "bold",
  marginBottom: 6,
  fontSize: 16
};