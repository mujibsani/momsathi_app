import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";

import AppContainer from "../components/AppContainer";
import { getTheme } from "../theme/colors";

import { getHistory } from "../services/history";
import {
  analyzeHistory,
  generateInsights,
  generatePredictions,
  generateSummary
} from "../engine/intelligenceEngine";

export default function WeeklyReportScreen() {
  const [history, setHistory] = useState([]);
  const theme = getTheme();

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

  const summary = useMemo(
    () => generateSummary(analysis, predictions),
    [analysis, predictions]
  );

  /* ---------------- CARD ---------------- */
  const Card = ({ children, bg }) => (
    <View
      style={{
        backgroundColor: bg || theme.card,
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
    <AppContainer>
      <ScrollView style={{ padding: 20 }}>

        {/* HEADER */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: theme.text
          }}
        >
          📅 Weekly Report
        </Text>

        {/* AI SUMMARY */}
        <Card>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            🧠 AI Summary
          </Text>

          <Text style={{ marginTop: 8, color: theme.subtext }}>
            {summary}
          </Text>
        </Card>

        {/* STATS */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Card>
              <Text style={{ color: theme.subtext }}>Score</Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginTop: 5,
                  color: theme.primary
                }}
              >
                {score}
              </Text>
            </Card>
          </View>

          <View style={{ flex: 1 }}>
            <Card>
              <Text style={{ color: theme.subtext }}>Total</Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginTop: 5
                }}
              >
                {total}
              </Text>
            </Card>
          </View>

          <View style={{ flex: 1 }}>
            <Card>
              <Text style={{ color: theme.subtext }}>High</Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginTop: 5,
                  color: theme.danger
                }}
              >
                {high}
              </Text>
            </Card>
          </View>
        </View>

        {/* INSIGHTS */}
        {insights.length > 0 && (
          <Card bg={theme.isDark ? "#2A1F0A" : "#FFF7E6"}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              🧠 Insights
            </Text>

            {insights.map((item, i) => (
              <Text key={i} style={{ marginTop: 6, color: theme.text }}>
                • {item}
              </Text>
            ))}
          </Card>
        )}

        {/* PREDICTIONS */}
        {predictions.length > 0 && (
          <Card bg={theme.isDark ? "#0F2A1F" : "#E8F5E9"}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              🔮 Predictions
            </Text>

            {predictions.map((item, i) => (
              <Text key={i} style={{ marginTop: 6, color: theme.text }}>
                • {item}
              </Text>
            ))}
          </Card>
        )}

        {/* TIMELINE */}
        <Card>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            📊 Weekly Timeline
          </Text>

          {weekly.length === 0 && (
            <Text style={{ marginTop: 8, color: theme.subtext }}>
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
                backgroundColor: theme.isDark
                  ? "#1E293B"
                  : "#F1F3FF"
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: theme.text
                }}
              >
                {item.problem}
              </Text>

              <Text style={{ color: theme.subtext }}>
                {item.date}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontWeight: "bold",
                  color:
                    item.urgency === "high"
                      ? theme.danger
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
    </AppContainer>
  );
}