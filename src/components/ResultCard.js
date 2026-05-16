// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";

// const COLORS = {
//   low: "#22C55E",
//   medium: "#F59E0B",
//   high: "#EF4444",
// };

// export default function ResultCard({ result, onClose }) {
//   if (!result) return null;

//   const risk = result.riskLevel || "low";
//   const confidence = Number(result.confidence) || 10;

//   const color =
//     risk === "high"
//       ? COLORS.high
//       : risk === "medium"
//       ? COLORS.medium
//       : COLORS.low;

//   return (
//     <View
//       style={{
//         backgroundColor: "#fff",
//         borderRadius: 20,
//         padding: 18,
//         elevation: 10,
//       }}
//     >
//       {/* HEADER */}
//       <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//         <Text style={{ fontWeight: "800", fontSize: 16 }}>
//           AI Analysis
//         </Text>

//         <TouchableOpacity onPress={onClose}>
//           <Text style={{ fontSize: 18 }}>✕</Text>
//         </TouchableOpacity>
//       </View>

//       {/* RISK */}
//       <Text style={{ marginTop: 10, fontWeight: "700", color }}>
//         {risk.toUpperCase()} RISK
//       </Text>

//       {/* CONFIDENCE */}
//       <View style={{ marginTop: 10 }}>
//         <Text>Confidence: {confidence}%</Text>

//         <View
//           style={{
//             height: 6,
//             backgroundColor: "#eee",
//             borderRadius: 4,
//             marginTop: 4,
//           }}
//         >
//           <View
//             style={{
//               width: `${confidence}%`,
//               height: 6,
//               backgroundColor: color,
//               borderRadius: 4,
//             }}
//           />
//         </View>
//       </View>

//       {/* TEXT */}
//       <Text style={{ marginTop: 12 }}>{result.insight}</Text>
//       <Text style={{ marginTop: 6 }}>{result.pregnancyAdvice}</Text>

//       {/* CTA */}
//       {risk === "high" && (
//         <TouchableOpacity
//           style={{
//             marginTop: 14,
//             backgroundColor: color,
//             padding: 12,
//             borderRadius: 12,
//           }}
//         >
//           <Text style={{ color: "#fff", textAlign: "center" }}>
//             Get Help Now
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }


import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";

/* ---------------- COLORS ---------------- */

const COLORS = {
  bg: "#FFFFFF",

  text: "#111827",
  sub: "#6B7280",

  border: "#E5E7EB",

  low: "#22C55E",
  medium: "#F59E0B",
  high: "#EF4444",

  emergency: "#DC2626",

  softLow: "#ECFDF5",
  softMedium: "#FFFBEB",
  softHigh: "#FEF2F2",
  softEmergency: "#FEE2E2",

  card: "#F8FAFC"
};

/* ---------------- HELPERS ---------------- */

const normalizeRisk = (risk) => {
  if (!risk) return "low";
  return String(risk).toLowerCase();
};

const safeConfidence = (value) => {
  const num = Number(value);

  if (isNaN(num) || num <= 0) return 40;

  if (num > 100) return 95;

  return Math.round(num);
};

const getMeta = (risk) => {
  switch (risk) {
    case "high":
      return {
        label: "High Risk",
        color: COLORS.high,
        bg: COLORS.softHigh,
        icon: "🚨"
      };

    case "medium":
      return {
        label: "Moderate Risk",
        color: COLORS.medium,
        bg: COLORS.softMedium,
        icon: "⚠️"
      };

    default:
      return {
        label: "Low Risk",
        color: COLORS.low,
        bg: COLORS.softLow,
        icon: "✅"
      };
  }
};

const getActions = (risk) => {
  switch (risk) {
    case "high":
      return [
        "Contact your healthcare provider",
        "Avoid self-medication",
        "Monitor symptoms carefully",
        "Seek emergency help if symptoms worsen"
      ];

    case "medium":
      return [
        "Rest and stay hydrated",
        "Monitor symptom changes",
        "Track body condition",
        "Consult doctor if needed"
      ];

    default:
      return [
        "Continue monitoring symptoms",
        "Maintain hydration",
        "Rest properly",
        "Keep tracking your pregnancy health"
      ];
  }
};

/* ---------------- SECTION ---------------- */

const Section = ({ title, children }) => (
  <View style={{ marginTop: 18 }}>
    <Text
      style={{
        fontWeight: "800",
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 8
      }}
    >
      {title}
    </Text>

    {children}
  </View>
);

/* ---------------- COMPONENT ---------------- */

export default function ResultCard({
  result,
  onClose
}) {
  if (!result) return null;

  const risk = normalizeRisk(
    result.riskLevel
  );

  const confidence = safeConfidence(
    result.confidence
  );

  const meta = getMeta(risk);

  const actions = getActions(risk);

  const insight =
    result.insight ||
    "No AI analysis available.";

  const energy =
    result.energy || "Stable";

  const mood =
    result.mood || "Normal";

  const pregnancyAdvice =
    result.pregnancyAdvice ||
    "No pregnancy advice available.";

  const alertMessage =
    result.alertMessage || "";

  const medicalSummary =
    result.medicalSummary || "";

  const emergencyLevel =
    result.emergencyLevel || "safe";

  const emergencyTitle =
    result.emergencyTitle || "";

  const emergencyReason =
    result.emergencyReason || "";

  const emergencyAction =
    result.emergencyAction || "";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 40
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: 20
        }}
      >
        {/* ---------------- HANDLE ---------------- */}

        {/* <View
          style={{
            width: 42,
            height: 5,
            backgroundColor: "#D1D5DB",
            borderRadius: 10,
            alignSelf: "center",
            marginBottom: 16
          }}
        /> */}

        {/* ---------------- HEADER ---------------- */}

        <View
          style={{
            flexDirection: "row",
            justifyContent:
              "space-between",
            alignItems: "center"
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "900",
                color: COLORS.text
              }}
            >
              AI Analysis
            </Text>

            <Text
              style={{
                color: COLORS.sub,
                marginTop: 4
              }}
            >
              Pregnancy symptom assessment
            </Text>
          </View>

          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor:
                  "#F3F4F6",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700"
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ---------------- EMERGENCY ---------------- */}

        {emergencyLevel !== "safe" && (
          <View
            style={{
              marginTop: 18,
              backgroundColor:
                COLORS.softEmergency,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor:
                COLORS.emergency
            }}
          >
            <Text
              style={{
                color: COLORS.emergency,
                fontWeight: "900",
                fontSize: 16
              }}
            >
              🚨 {emergencyTitle}
            </Text>

            <Text
              style={{
                marginTop: 8,
                color: COLORS.text,
                lineHeight: 22
              }}
            >
              {emergencyReason}
            </Text>

            <View
              style={{
                marginTop: 12,
                backgroundColor:
                  "#fff",
                padding: 12,
                borderRadius: 14
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color:
                    COLORS.emergency
                }}
              >
                Recommended Action
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  color: COLORS.text
                }}
              >
                {emergencyAction}
              </Text>
            </View>
          </View>
        )}

        {/* ---------------- RISK CARD ---------------- */}

        <View
          style={{
            marginTop: 18,
            backgroundColor: meta.bg,
            borderRadius: 20,
            padding: 18
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              alignItems: "center"
            }}
          >
            <View>
              <Text
                style={{
                  color: COLORS.sub,
                  fontWeight: "600"
                }}
              >
                Risk Assessment
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 24,
                  fontWeight: "900",
                  color: meta.color
                }}
              >
                {meta.icon} {meta.label}
              </Text>
            </View>

            <View
              style={{
                alignItems: "flex-end"
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "900",
                  color: meta.color
                }}
              >
                {confidence}%
              </Text>

              <Text
                style={{
                  color: COLORS.sub
                }}
              >
                Confidence
              </Text>
            </View>
          </View>

          {/* PROGRESS */}

          <View
            style={{
              marginTop: 16,
              height: 8,
              backgroundColor:
                "#E5E7EB",
              borderRadius: 20,
              overflow: "hidden"
            }}
          >
            <View
              style={{
                width: `${confidence}%`,
                height: 8,
                backgroundColor:
                  meta.color,
                borderRadius: 20
              }}
            />
          </View>
        </View>

        {/* ---------------- STATUS ---------------- */}

        <Section title="🧠 AI Status">
          <View
            style={{
              backgroundColor:
                COLORS.card,
              padding: 14,
              borderRadius: 16
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                lineHeight: 24
              }}
            >
              {mood}
            </Text>

            <Text
              style={{
                color: COLORS.sub,
                marginTop: 8,
                lineHeight: 22
              }}
            >
              {energy}
            </Text>
          </View>
        </Section>

        {/* ---------------- SUMMARY ---------------- */}

        <Section title="📋 Medical Summary">
          <View
            style={{
              backgroundColor:
                COLORS.card,
              padding: 16,
              borderRadius: 16
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                lineHeight: 24
              }}
            >
              {medicalSummary}
            </Text>

            {!!alertMessage && (
              <Text
                style={{
                  marginTop: 10,
                  color: meta.color,
                  fontWeight: "700",
                  lineHeight: 22
                }}
              >
                {alertMessage}
              </Text>
            )}
          </View>
        </Section>

        {/* ---------------- INSIGHT ---------------- */}

        <Section title="✨ AI Insight">
          <View
            style={{
              backgroundColor:
                COLORS.card,
              padding: 16,
              borderRadius: 16
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                lineHeight: 25
              }}
            >
              {insight}
            </Text>
          </View>
        </Section>

        {/* ---------------- PREGNANCY ---------------- */}

        <Section title="🤰 Pregnancy Advice">
          <View
            style={{
              backgroundColor:
                "#EEF2FF",
              padding: 16,
              borderRadius: 16
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                lineHeight: 24
              }}
            >
              {pregnancyAdvice}
            </Text>
          </View>
        </Section>

        {/* ---------------- ACTIONS ---------------- */}

        <Section title="✅ Recommended Actions">
          <View
            style={{
              backgroundColor:
                meta.bg,
              borderRadius: 16,
              padding: 16
            }}
          >
            {actions.map((a, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  marginBottom:
                    i ===
                    actions.length - 1
                      ? 0
                      : 12
                }}
              >
                <Text
                  style={{
                    color: meta.color,
                    marginRight: 8,
                    fontWeight: "700"
                  }}
                >
                  •
                </Text>

                <Text
                  style={{
                    flex: 1,
                    color: COLORS.text,
                    lineHeight: 22
                  }}
                >
                  {a}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        {/* ---------------- CTA ---------------- */}

        {(risk === "high" ||
          emergencyLevel !== "safe") && (
          <TouchableOpacity
            style={{
              marginTop: 22,
              backgroundColor:
                COLORS.emergency,
              paddingVertical: 18,
              borderRadius: 18,
              alignItems: "center",
              elevation: 4
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "900",
                fontSize: 16
              }}
            >
              🚑 Seek Medical Attention
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}