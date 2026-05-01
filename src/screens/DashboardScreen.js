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

import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";

import { calculateWeek } from "../utils/pregnancy";

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
  const [user, setUser] = useState(null);

  /* ---------------- REALTIME HISTORY ---------------- */
  useEffect(() => {
    const unsubscribe = subscribeHistory((data) => {
      setHistory(data || []);
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- LOAD USER PROFILE ---------------- */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUser(snap.data());
        }
      } catch (e) {
        console.log("USER LOAD ERROR:", e);
      }
    };

    loadUser();
  }, []);

  /* ---------------- PREGNANCY WEEK (DYNAMIC CORE) ---------------- */
  const week = useMemo(() => {
    if (!user) return 1;

    // 1. AUTO CALCULATE (BEST METHOD)
    if (user.pregnancyStartDate) {
      return calculateWeek(user.pregnancyStartDate);
    }

    // 2. MANUAL INITIAL WEEK (fallback)
    if (user.initialWeek) {
      return user.initialWeek;
    }

    // 3. OLD SYSTEM fallback
    return user.pregnancyWeek || 1;
  }, [user]);

  /* ---------------- RECENT 7 DAYS ---------------- */
  const recent = useMemo(() => {
    const now = Date.now();

    return history.filter((item) => {
      const ts = item?.timestamp;
      if (!ts) return false;

      const diffDays = (now - ts) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    });
  }, [history]);

  /* ---------------- STATS ---------------- */
  const total = recent.length;
  const high = recent.filter(i => i.urgency === "high").length;

  /* ---------------- AI LAYERS ---------------- */
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

  /* ---------------- SUMMARY ---------------- */
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
          Week {week} • AI-powered pregnancy monitoring
        </Text>

        {/* EMERGENCY */}
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

        {/* SCORE */}
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

        {/* SUMMARY */}
        <Card>
          <Text style={{ fontWeight: "bold" }}>🧠 AI Summary</Text>

          <Text style={{ marginTop: 8, color: COLORS.sub, lineHeight: 20 }}>
            {summary}
          </Text>
        </Card>

        {/* STATS */}
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

        {/* RECENT */}
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