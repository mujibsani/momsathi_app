import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import API from "../services/api";
import SymptomCard from "../components/SymptomCard";
import { getUrgencyColor } from "../utils/colors";
import DangerAlert from "../components/DangerAlert";

export default function SymptomScreen() {
  const [result, setResult] = useState(null);

  const symptoms = [
    { label: "Back Pain", slug: "back-pain" },
    { label: "Headache", slug: "headache" },
    { label: "Swelling", slug: "swelling" },
    { label: "Stress", slug: "stress" },
    { label: "Nausea", slug: "nausea" }
  ];

  const checkProblem = async (slug) => {
    try {
      const res = await API.get(
        `/problems/helper/?problem=${slug}`
      );
      setResult(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#F6F8FF" }}>

      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        What are you feeling?
      </Text>

      <Text style={{ marginBottom: 20, color: "#666" }}>
        Tap your symptom
      </Text>

      {/* Symptom buttons */}
      {symptoms.map((item, i) => (
        <SymptomCard
          key={i}
          label={item.label}
          onPress={() => checkProblem(item.slug)}
        />
      ))}

      {/* RESULT UI */}
      {result && (
        <View
          style={{
            marginTop: 25,
            backgroundColor: "white",
            padding: 20,
            borderRadius: 15,
            elevation: 5,
            borderLeftWidth: 6,
            borderLeftColor: getUrgencyColor(result.urgency)
          }}
        >

          {/* Title */}
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {result.problem}
          </Text>

          {/* Urgency */}
          <Text
            style={{
              marginTop: 5,
              fontWeight: "bold",
              color: getUrgencyColor(result.urgency)
            }}
          >
            {result.urgency.toUpperCase()}
          </Text>
          {result.urgency === "danger" && (
            <DangerAlert warning={result.warning} />
          )}

          {/* Advice */}
          <Text style={{ marginTop: 10 }}>
            {result.what_to_do}
          </Text>

          {/* Avoid */}
          <Text style={{ marginTop: 10 }}>
            Avoid: {result.avoid}
          </Text>

          {/* Exercises */}
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>
            Exercises:
          </Text>

          {result.exercises.map((ex, i) => (
            <Text key={i}>
              • {ex.name} ({ex.duration} min)
            </Text>
          ))}

        </View>
      )}

    </ScrollView>
  );
}