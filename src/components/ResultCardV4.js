import React from "react";
import { View, Text } from "react-native";

const COLORS = {
  red: "#EF4444",
  orange: "#F59E0B",
  green: "#22C55E",
  bg: "#FFFFFF",
};

export default function ResultCardV4({ data }) {
  if (!data) return null;

  const isEmergency = data.level === "EMERGENCY";

  const color =
    data.level === "EMERGENCY"
      ? COLORS.red
      : data.level === "HIGH"
      ? COLORS.orange
      : COLORS.green;

  return (
    <View
      style={{
        backgroundColor: COLORS.bg,
        padding: 16,
        borderRadius: 16,
        elevation: 5,
        borderLeftWidth: 6,
        borderLeftColor: color,
        marginTop: 10,
      }}
    >
      {/* HEADER */}
      <Text style={{ fontSize: 16, fontWeight: "800" }}>
        🧠 Medical Triage Report
      </Text>

      {/* SCORE */}
      <Text style={{ marginTop: 6 }}>
        Severity Score: {data.score}/100
      </Text>

      <Text style={{ marginTop: 4 }}>
        Confidence: {data.confidence}%
      </Text>

      {/* INSIGHT */}
      <Text style={{ marginTop: 10, fontWeight: "600" }}>
        {data.insight}
      </Text>

      {/* EMERGENCY ACTION */}
      <Text
        style={{
          marginTop: 10,
          color: color,
          fontWeight: "800",
        }}
      >
        {data.emergencyAction}
      </Text>

      {/* PREGNANCY */}
      {data.pregnancyAdvice && (
        <Text style={{ marginTop: 10 }}>
          🤰 {data.pregnancyAdvice}
        </Text>
      )}
    </View>
  );
}