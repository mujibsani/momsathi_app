import React from "react";
import { View, Text } from "react-native";
import { getUrgencyColor } from "../utils/colors";

export default function ResultCard({ result }) {
  const color = getUrgencyColor(result.urgency);

  return (
    <View
      style={{
        marginTop: 25,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 15,
        elevation: 5,
        borderLeftWidth: 6,
        borderLeftColor: color
      }}
    >

      {/* TITLE */}
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {result.problem}
      </Text>

      {/* URGENCY */}
      <Text
        style={{
          marginTop: 5,
          fontWeight: "bold",
          color: color
        }}
      >
        {result.urgency.toUpperCase()}
      </Text>

      {/* DANGER ALERT */}
      {result.urgency === "danger" && (
        <View
          style={{
            backgroundColor: "#FFEBEE",
            padding: 10,
            marginTop: 10,
            borderRadius: 8
          }}
        >
          <Text style={{ color: "#C62828", fontWeight: "bold" }}>
            ⚠️ Seek medical help immediately
          </Text>
        </View>
      )}

      {/* ADVICE */}
      <Text style={{ marginTop: 10 }}>
        {result.what_to_do}
      </Text>

      {/* AVOID */}
      <Text style={{ marginTop: 10 }}>
        Avoid: {result.avoid}
      </Text>

      {/* EXERCISES */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Exercises:
      </Text>

      {result.exercises.map((ex, i) => (
        <Text key={i}>
          • {ex.name} ({ex.duration} min)
        </Text>
      ))}
    </View>
  );
}