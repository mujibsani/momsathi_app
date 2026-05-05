import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const COLORS = {
  low: "#22C55E",
  medium: "#F59E0B",
  high: "#EF4444",
};

export default function ResultCard({ result, onClose }) {
  if (!result) return null;

  const risk = result.riskLevel || "low";
  const confidence = Number(result.confidence) || 10;

  const color =
    risk === "high"
      ? COLORS.high
      : risk === "medium"
      ? COLORS.medium
      : COLORS.low;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 18,
        elevation: 10,
      }}
    >
      {/* HEADER */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "800", fontSize: 16 }}>
          AI Analysis
        </Text>

        <TouchableOpacity onPress={onClose}>
          <Text style={{ fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* RISK */}
      <Text style={{ marginTop: 10, fontWeight: "700", color }}>
        {risk.toUpperCase()} RISK
      </Text>

      {/* CONFIDENCE */}
      <View style={{ marginTop: 10 }}>
        <Text>Confidence: {confidence}%</Text>

        <View
          style={{
            height: 6,
            backgroundColor: "#eee",
            borderRadius: 4,
            marginTop: 4,
          }}
        >
          <View
            style={{
              width: `${confidence}%`,
              height: 6,
              backgroundColor: color,
              borderRadius: 4,
            }}
          />
        </View>
      </View>

      {/* TEXT */}
      <Text style={{ marginTop: 12 }}>{result.insight}</Text>
      <Text style={{ marginTop: 6 }}>{result.pregnancyAdvice}</Text>

      {/* CTA */}
      {risk === "high" && (
        <TouchableOpacity
          style={{
            marginTop: 14,
            backgroundColor: color,
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Get Help Now
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}