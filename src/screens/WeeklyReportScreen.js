import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import { getHistory } from "../services/history";
import { analyzeHistory, generateInsights } from "../engine/intelligenceEngine";
import { generatePredictions } from "../engine/predictionEngine";

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
  const getWeeklyData = () => {
    const now = new Date();

    return history.filter((item) => {
      if (!item?.date) return false;

      const itemDate = new Date(item.date);
      const diffDays =
        (now - itemDate) / (1000 * 60 * 60 * 24);

      return diffDays <= 7;
    });
  };

  const weekly = getWeeklyData();

  /* ---------------- STATS ---------------- */
  const total = weekly.length;

  const high = weekly.filter(
    (i) => i.urgency === "high"
  ).length;

  /* ---------------- AI ---------------- */
  const analysis = analyzeHistory(weekly);
  const insights = generateInsights(analysis);
  const predictions = generatePredictions(weekly);

  /* ---------------- SCORE ---------------- */
  const score =
    total === 0 ? 100 : Math.max(100 - high * 20, 30);

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#F6F8FF"
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        📅 Weekly Report
      </Text>

      {/* SCORE */}
      <View style={card}>
        <Text style={title}>Health Score</Text>
        <Text style={value}>{score}/100</Text>
      </View>

      {/* TOTAL */}
      <View style={card}>
        <Text style={title}>Total Symptoms</Text>
        <Text style={value}>{total}</Text>
      </View>

      {/* HIGH */}
      <View style={card}>
        <Text style={title}>High Risk</Text>
        <Text style={value}>{high}</Text>
      </View>

      {/* INSIGHTS */}
      {insights.length > 0 && (
        <View style={cardYellow}>
          <Text style={header}>🧠 Insights</Text>
          {insights.map((item, i) => (
            <Text key={`ins-${i}`} style={{ marginTop: 4 }}>
              {item}
            </Text>
          ))}
        </View>
      )}

      {/* PREDICTIONS */}
      {predictions.length > 0 && (
        <View style={cardGreen}>
          <Text style={header}>🔮 Predictions</Text>
          {predictions.map((item, i) => (
            <Text key={`pred-${i}`} style={{ marginTop: 4 }}>
              {item}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const card = {
  marginTop: 15,
  padding: 20,
  backgroundColor: "white",
  borderRadius: 12
};

const cardYellow = {
  marginTop: 15,
  padding: 20,
  backgroundColor: "#FFF7E6",
  borderRadius: 12
};

const cardGreen = {
  marginTop: 15,
  padding: 20,
  backgroundColor: "#E8F5E9",
  borderRadius: 12
};

const title = {
  fontSize: 14,
  color: "#666"
};

const value = {
  fontSize: 20,
  fontWeight: "bold",
  marginTop: 5
};

const header = {
  fontWeight: "bold",
  marginBottom: 5
};