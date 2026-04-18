import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import API from "../services/api";
import SymptomCard from "../components/SymptomCard";
import ResultCard from "../components/ResultCard";
import DangerAlert from "../components/DangerAlert";

export default function SymptomScreen() {
  const [result, setResult] = useState(null);

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
    try {
      const res = await API.get(
        `/problems/helper/?problem=${slug}`
      );
      setResult(res.data);
    } catch (err) {
      console.log("API Error:", err);
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

      {/* Result UI */}
      {result && (
        <>
          <ResultCard result={result} />

          {/* Danger alert only */}
          {result?.urgency === "danger" && (
            <DangerAlert warning={result.warning} />
          )}
        </>
      )}

    </ScrollView>
  );
}