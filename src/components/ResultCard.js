import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#FFFFFF",
  text: "#111827",
  sub: "#6B7280",

  low: "#22C55E",
  medium: "#F59E0B",
  high: "#EF4444",

  softLow: "#ECFDF5",
  softMedium: "#FFFBEB",
  softHigh: "#FEF2F2"
};

/* ---------------- HELPERS ---------------- */
const getRiskMeta = (risk) => {
  if (risk === "high") {
    return {
      label: "High Risk",
      color: COLORS.high,
      bg: COLORS.softHigh,
      icon: "🚨"
    };
  }
  if (risk === "medium") {
    return {
      label: "Moderate Risk",
      color: COLORS.medium,
      bg: COLORS.softMedium,
      icon: "⚠️"
    };
  }
  return {
    label: "Low Risk",
    color: COLORS.low,
    bg: COLORS.softLow,
    icon: "✅"
  };
};

const getSmartActions = (risk) => {
  if (risk === "high") {
    return [
      "Contact your doctor immediately",
      "Visit hospital if symptoms increase",
      "Avoid self-medication"
    ];
  }

  if (risk === "medium") {
    return [
      "Monitor symptoms closely",
      "Stay hydrated and rest",
      "Consult doctor if needed"
    ];
  }

  return [
    "This is usually normal in pregnancy",
    "Stay hydrated",
    "Rest and observe your body"
  ];
};

/* ---------------- COMPONENT ---------------- */
export default function ResultCard({ result }) {
  if (!result) return null;

  /* ✅ SAFE DATA HANDLING */
  const label = result.label || "Symptom Analysis";
  const risk = result.riskLevel || result.urgency || "low";

  const safeConfidence = Number(result.confidence) || 0;

  const explanation = result.explanation || "";
  const pregnancyAdvice = result.pregnancyAdvice || "";

  const meta = getRiskMeta(risk);
  const actions = getSmartActions(risk);

  return (
    <View
      style={{
        backgroundColor: COLORS.bg,
        borderRadius: 20,
        padding: 18,
        marginTop: 10,
        elevation: 4
      }}
    >
      {/* HEADER */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "800", fontSize: 16 }}>
          {label}
        </Text>

        <View
          style={{
            backgroundColor: meta.bg,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12
          }}
        >
          <Text style={{ color: meta.color, fontWeight: "700" }}>
            {meta.icon} {meta.label}
          </Text>
        </View>
      </View>

      {/* CONFIDENCE */}
      <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 12, color: COLORS.sub }}>
          Confidence: {Math.round(safeConfidence * 100)}%
        </Text>

        <View
          style={{
            height: 6,
            backgroundColor: "#E5E7EB",
            borderRadius: 4,
            marginTop: 6
          }}
        >
          <View
            style={{
              width: (safeConfidence * 100) + "%",
              height: 6,
              backgroundColor: meta.color,
              borderRadius: 4
            }}
          />
        </View>
      </View>

      {/* AI INSIGHT */}
      {explanation ? (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontWeight: "700" }}>🧠 AI Insight</Text>
          <Text style={{ marginTop: 6, color: COLORS.text }}>
            {explanation}
          </Text>
        </View>
      ) : null}

      {/* PREGNANCY ADVICE */}
      {pregnancyAdvice ? (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontWeight: "700" }}>🤰 Pregnancy Advice</Text>
          <Text style={{ marginTop: 6 }}>
            {pregnancyAdvice}
          </Text>
        </View>
      ) : null}

      {/* ACTIONS */}
      <View
        style={{
          marginTop: 16,
          backgroundColor: meta.bg,
          padding: 12,
          borderRadius: 12
        }}
      >
        <Text style={{ fontWeight: "700" }}>
          {meta.icon} What to do now
        </Text>

        {actions.map((a, i) => (
          <Text key={i} style={{ marginTop: 6 }}>
            • {a}
          </Text>
        ))}
      </View>

      {/* HIGH RISK CTA */}
      {risk === "high" && (
        <TouchableOpacity
          style={{
            marginTop: 14,
            backgroundColor: COLORS.high,
            padding: 14,
            borderRadius: 14,
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            🚑 Get Help Now
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}