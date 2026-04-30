import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";

import AppContainer from "../components/AppContainer";
import { subscribeHistory } from "../services/historyApi";

import {
  analyzeHistory,
  generateInsights
} from "../engine/intelligenceEngine";

import { generatePredictions } from "../engine/predictionEngine";
import { analyzeAdvanced } from "../engine/advancedIntelligenceEngine";
import { detectEmergency } from "../engine/emergencyEngine";

import AsyncStorage from "@react-native-async-storage/async-storage";

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#F6F8FF",
  card: "#FFFFFF",
  primary: "#2D3A8C",
  success: "#43A047",
  danger: "#E53935",
  warning: "#FB8C00",
  text: "#222",
  sub: "#666"
};

export default function DashboardScreen() {
  const [history, setHistory] = useState([]);
  const [week, setWeek] = useState(20);

  /* ---------------- REALTIME ---------------- */
  useEffect(() => {
    const unsubscribe = subscribeHistory((data) => {
      setHistory(data || []);
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- LOAD WEEK ---------------- */
  useEffect(() => {
    const loadWeek = async () => {
      const w = await AsyncStorage.getItem("pregnancy_week");
      if (w) setWeek(parseInt(w));
    };
    loadWeek();
  }, []);

  // See the history data 
  // useEffect(() => {
  //   console.log("RAW HISTORY:", history);
  // }, [history]);
  /* ---------------- RECENT 7 DAYS (FIXED DATE SAFETY) ---------------- */
  const recent = useMemo(() => {
    const now = Date.now();

    return history.filter((item) => {
      const ts = item?.timestamp;

      if (!ts) return false;

      const diffDays = (now - ts) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    });
  }, [history]);

  /* ---------------- BASIC STATS ---------------- */
  const total = recent.length;
  const high = recent.filter(i => i.urgency === "high").length;

  /* ---------------- AI LAYER ---------------- */
  const advanced = useMemo(
    () => analyzeAdvanced(recent, week),
    [recent, week]
  );

  const emergency = useMemo(
    () => detectEmergency(recent, week),
    [recent, week]
  );

  const analysis = useMemo(() => analyzeHistory(recent), [recent]);
  const insights = useMemo(() => generateInsights(analysis), [analysis]);
  const predictions = useMemo(() => generatePredictions(recent), [recent]);

  /* ---------------- CLEAN SUMMARY (IMPROVED UX TEXT) ---------------- */
  const summary = useMemo(() => {
    if (total === 0) {
      return "Start tracking symptoms to get personalized pregnancy insights.";
    }

    if (advanced.riskLevel === "low") {
      return "Your health looks stable. Keep maintaining your current routine.";
    }

    if (advanced.riskLevel === "medium") {
      return "Some symptoms need attention. Monitor and stay hydrated.";
    }

    return "High risk pattern detected. Consider consulting a doctor soon.";
  }, [total, advanced.riskLevel]);

  /* ---------------- SCORE COLOR ---------------- */
  const getScoreColor = () => {
    if (advanced.riskScore >= 80) return COLORS.danger;
    if (advanced.riskScore >= 50) return COLORS.warning;
    return COLORS.success;
  };

  /* ---------------- CARD ---------------- */
  const Card = ({ children }) => (
    <View
      style={{
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        marginTop: 14,
        elevation: 3
      }}
    >
      {children}
    </View>
  );

  return (
    <AppContainer>
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg, padding: 20 }}>

        {/* HEADER */}
        <Text style={{ fontSize: 28, fontWeight: "700", color: COLORS.primary }}>
          📊 Health Dashboard
        </Text>

        <Text style={{ color: COLORS.sub, marginTop: 4 }}>
          AI-powered pregnancy monitoring
        </Text>

        {/* 🚨 EMERGENCY (HIGH PRIORITY UI) */}
        {emergency.isEmergency && (
          <View
            style={{
              backgroundColor:
                emergency.level === "critical"
                  ? COLORS.danger
                  : COLORS.warning,
              padding: 16,
              borderRadius: 16,
              marginTop: 18
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              🚨 Emergency Alert
            </Text>
            <Text style={{ color: "white", marginTop: 6 }}>
              {emergency.message}
            </Text>
          </View>
        )}

        {/* SCORE (MAIN FOCUS) */}
        <Card>
          <Text style={{ fontWeight: "bold" }}>Health Risk Score</Text>

          <Text
            style={{
              fontSize: 42,
              fontWeight: "bold",
              marginTop: 8,
              color: getScoreColor()
            }}
          >
            {advanced.riskScore}
          </Text>

          <Text style={{ marginTop: 4, fontWeight: "600", color: getScoreColor() }}>
            {advanced.riskLevel.toUpperCase()}
          </Text>
        </Card>

        {/* AI SUMMARY */}
        <Card>
          <Text style={{ fontWeight: "bold" }}>🧠 AI Summary</Text>

          <Text style={{ marginTop: 8, color: COLORS.sub, lineHeight: 20 }}>
            {summary}
          </Text>
        </Card>

        {/* QUICK STATS */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Card>
            <Text>Total</Text>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{total}</Text>
          </Card>

          <Card>
            <Text>High Risk</Text>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{high}</Text>
          </Card>

          <Card>
            <Text>Trend</Text>
            <Text style={{ fontWeight: "bold" }}>
              {analysis.trend || "stable"}
            </Text>
          </Card>
        </View>

        {/* INSIGHTS */}
        {insights.length > 0 && (
          <Card>
            <Text style={{ fontWeight: "bold" }}>🧠 Insights</Text>
            {insights.map((i, idx) => (
              <Text key={idx} style={{ marginTop: 6 }}>
                • {i}
              </Text>
            ))}
          </Card>
        )}

        {/* PREDICTIONS */}
        {predictions.length > 0 && (
          <Card>
            <Text style={{ fontWeight: "bold" }}>🔮 Predictions</Text>
            {predictions.map((p, idx) => (
              <Text key={idx} style={{ marginTop: 6 }}>
                • {p}
              </Text>
            ))}
          </Card>
        )}

        {/* RECENT ACTIVITY */}
        <Card>
          <Text style={{ fontWeight: "bold" }}>Recent Activity</Text>

          {recent.length > 0 ? (
            recent.slice(0, 3).map((item) => (
              <View key={item.id} style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "500" }}>{item.problem}</Text>
                <Text style={{ color: COLORS.sub }}>
                  {item.date}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ marginTop: 8, color: COLORS.sub }}>
              No recent activity yet
            </Text>
          )}
        </Card>

      </ScrollView>
    </AppContainer>
  );
}