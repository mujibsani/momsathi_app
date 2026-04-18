import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import API from "../services/api";
import SymptomCard from "../components/SymptomCard";
import ResultCard from "../components/ResultCard";
import DangerAlert from "../components/DangerAlert";

export default function SymptomScreen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tap-based symptoms (no typing)
  const symptoms = [
    { label: "Back Pain", slug: "back-pain", icon: "🦴", category: "Body Pain" },
    { label: "Headache", slug: "headache", icon: "🧠", category: "Pain" },
    { label: "Swelling", slug: "swelling", icon: "🦵", category: "Body Changes" },
    { label: "Stress", slug: "stress", icon: "😣", category: "Mental" },
    { label: "Nausea", slug: "nausea", icon: "🤢", category: "Digestion" }
  ];

  // API call
  const checkProblem = async (slug) => {
    if (loading) return; // prevent spam clicks

    setLoading(true);
    setResult(null);

    try {
      const res = await API.get(
        `/problems/helper/?problem=${slug}`
      );
      setResult(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#F6F8FF"
      }}
    >

      {/* Title */}
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        What are you feeling?
      </Text>

      <Text style={{ marginBottom: 20, color: "#666" }}>
        Tap a symptom to get instant guidance
      </Text>

      {/* Symptom Buttons */}
      {symptoms.map((item, i) => (
        <SymptomCard
          key={i}
          label={item.label}
          icon={item.icon}
          category={item.category}
          onPress={() => checkProblem(item.slug)}
        />
      ))}
      {!loading && !result && (
        <View
          style={{
            marginTop: 30,
            padding: 20,
            backgroundColor: "#F0F5FF",
            borderRadius: 12
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            👋 Welcome to MomSathi
          </Text>

          <Text style={{ marginTop: 5, color: "#555" }}>
            Tap a symptom to get safe pregnancy guidance
          </Text>
        </View>
      )}
      {loading && (
        <View
          style={{
            marginTop: 20,
            backgroundColor: "white",
            padding: 20,
            borderRadius: 15,
            elevation: 5,
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            🧠 Analyzing your symptoms
          </Text>

          <Text style={{ marginTop: 6, color: "#666" }}>
            Please wait, preparing safe guidance for you...
          </Text>

          <Text style={{ marginTop: 10, fontSize: 12, color: "#999" }}>
            MomSathi is checking medical patterns
          </Text>
        </View>
      )}
      {/* Result UI */}
      {result && (
        <View
          style={{
            marginTop: 25,
            backgroundColor: "white",
            borderRadius: 16,
            padding: 18,
            elevation: 6,
            borderLeftWidth: 6,
            borderLeftColor:
              result.urgency === "danger"
                ? "#FF4D4F"
                : result.urgency === "warning"
                ? "#FAAD14"
                : "#52C41A"
          }}
        >

          {/* HEADER */}
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {result.problem}
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontWeight: "bold",
              color:
                result.urgency === "danger"
                  ? "#FF4D4F"
                  : result.urgency === "warning"
                  ? "#FAAD14"
                  : "#52C41A"
            }}
          >
            {result.urgency.toUpperCase()}
          </Text>

          {/* WHAT TO DO */}
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
              What to do
            </Text>
            <Text style={{ color: "#333", lineHeight: 20 }}>
              {result.what_to_do}
            </Text>
          </View>

          {/* AVOID */}
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
              Avoid
            </Text>
            <Text style={{ color: "#333", lineHeight: 20 }}>
              {result.avoid}
            </Text>
          </View>

          {/* EXERCISES */}
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Recommended Exercises
            </Text>

            {result.exercises.map((ex, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: "#F6F8FF",
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 8
                }}
              >
                <Text style={{ fontWeight: "500" }}>
                  • {ex.name}
                </Text>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  Duration: {ex.duration} min
                </Text>
              </View>
            ))}
          </View>

        </View>
      )}

    </ScrollView>
  );
}