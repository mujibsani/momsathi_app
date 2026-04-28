import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppContainer from "../components/AppContainer";

import { getHistory } from "../services/history";
import { analyzeHistory, generateInsights } from "../engine/intelligenceEngine";
import { generateAlerts } from "../engine/alertEngine";

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#F6F8FF",
  card: "#FFFFFF",
  primary: "#2D3A8C",
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#E53935",
  alertBg: "#FFECEC",
  insightBg: "#FFF7E6",
  text: "#222",
  subtext: "#666"
};

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

  /* ---------------- CARD ---------------- */
  const Card = ({ children }) => (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 18,
        marginTop: 15,
        elevation: 3
      }}
    >
      {children}
    </View>
  );

  return (
    <AppContainer>
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView style={{ padding: 20 }}>

        {/* HEADER */}
        <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.text }}>
          📊 Health Dashboard
        </Text>

        {/* SCORE */}
        <Card>
          <Text style={{ color: COLORS.subtext }}>Health Score</Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: COLORS.primary,
              marginTop: 5
            }}
          >
            {score}/100
          </Text>
        </Card>

        {/* STATS ROW */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Card>
              <Text style={{ color: COLORS.subtext }}>Total</Text>
              <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 5 }}>
                {total}
              </Text>
            </Card>
          </View>

          <View style={{ flex: 1 }}>
            <Card>
              <Text style={{ color: COLORS.subtext }}>High Risk</Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginTop: 5,
                  color: COLORS.danger
                }}
              >
                {highRisk}
              </Text>
            </Card>
          </View>
        </View>

        {/* ALERTS */}
        {alerts.length > 0 && (
          <View
            style={{
              backgroundColor: COLORS.alertBg,
              borderRadius: 16,
              padding: 16,
              marginTop: 15
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              🚨 Alerts
            </Text>

            {alerts.slice(0, 2).map((a, i) => (
              <Text key={i} style={{ marginTop: 6 }}>
                • {a}
              </Text>
            ))}
          </View>
        )}

        {/* INSIGHT */}
        {insights.length > 0 && (
          <View
            style={{
              backgroundColor: COLORS.insightBg,
              borderRadius: 16,
              padding: 16,
              marginTop: 15
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              🧠 AI Insight
            </Text>

            <Text style={{ marginTop: 6 }}>
              {insights[0]}
            </Text>
          </View>
        )}

        {/* BUTTON */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Report")}
          style={{
            marginTop: 25,
            backgroundColor: COLORS.primary,
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
            elevation: 3
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            📅 View Weekly Report
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
    </AppContainer>
  );
}