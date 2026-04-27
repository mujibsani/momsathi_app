import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import { getHistory } from "../services/history";
import { analyzeHistory, generateInsights } from "../engine/intelligenceEngine";
import { generateAlerts } from "../engine/alertEngine";

import { useNavigation } from "@react-navigation/native";

export default function DashboardScreen() {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    const load = async () => {
      const data = await getHistory();
      setHistory(data || []);
    };

    load();
  }, []);

  /* ---------------- AI ---------------- */
  const analysis = useMemo(() => analyzeHistory(history), [history]);
  const insights = useMemo(() => generateInsights(analysis), [analysis]);
  const alerts = useMemo(() => generateAlerts(history), [history]);

  /* ---------------- STATS ---------------- */
  const total = history.length;

  const highRisk = history.filter(
    (i) => i.urgency === "high"
  ).length;

  const score =
    total === 0 ? 100 : Math.max(100 - highRisk * 20, 30);

  /* ---------------- UI ---------------- */
  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#F6F8FF" }}>
      
      {/* HEADER */}
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        📊 Health Dashboard
      </Text>

      {/* SCORE CARD */}
      <View style={card}>
        <Text style={title}>Health Score</Text>
        <Text style={value}>{score}/100</Text>
      </View>

      {/* TOTAL */}
      <View style={card}>
        <Text style={title}>Total Symptoms</Text>
        <Text style={value}>{total}</Text>
      </View>

      {/* HIGH RISK */}
      <View style={card}>
        <Text style={title}>High Risk Cases</Text>
        <Text style={value}>{highRisk}</Text>
      </View>

      {/* ALERT PREVIEW */}
      {alerts.length > 0 && (
        <View style={alertBox}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            🚨 Alerts
          </Text>

          {alerts.slice(0, 2).map((a, i) => (
            <Text key={i}>• {a}</Text>
          ))}
        </View>
      )}

      {/* INSIGHT PREVIEW */}
      {insights.length > 0 && (
        <View style={insightBox}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            🧠 AI Insight
          </Text>

          <Text>{insights[0]}</Text>
        </View>
      )}

      {/* ACTION BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate("WeeklyReport")}
        style={button}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          📅 View Weekly Report
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const card = {
  marginTop: 15,
  padding: 18,
  backgroundColor: "white",
  borderRadius: 12
};

const alertBox = {
  marginTop: 15,
  padding: 15,
  backgroundColor: "#FFECEC",
  borderRadius: 12
};

const insightBox = {
  marginTop: 15,
  padding: 15,
  backgroundColor: "#FFF7E6",
  borderRadius: 12
};

const button = {
  marginTop: 25,
  backgroundColor: "#2D3A8C",
  padding: 15,
  borderRadius: 12,
  alignItems: "center"
};

const title = {
  color: "#666"
};

const value = {
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 5
};