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

      {/* Title */}
      <Text style={{
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5
      }}>
        {result.problem}
      </Text>

      {/* Urgency */}
      <Text style={{
        color: color,
        fontWeight: "bold",
        marginBottom: 10
      }}>
        {result.urgency.toUpperCase()}
      </Text>

      {/* What to do */}
      <Text style={{
        fontWeight: "600",
        marginBottom: 3
      }}>
        What to do
      </Text>
      <Text style={{ marginBottom: 10 }}>
        {result.what_to_do}
      </Text>

      {/* Avoid */}
      <Text style={{
        fontWeight: "600",
        marginBottom: 3
      }}>
        Avoid
      </Text>
      <Text style={{ marginBottom: 10 }}>
        {result.avoid}
      </Text>

      {/* Exercises */}
      <Text style={{
        fontWeight: "600",
        marginBottom: 5
      }}>
        Exercises
      </Text>

      {result.exercises.map((ex, i) => (
        <View
          key={i}
          style={{
            backgroundColor: "#F6F8FF",
            padding: 10,
            borderRadius: 10,
            marginBottom: 5
          }}
        >
          <Text>
            {ex.name} • {ex.duration} min
          </Text>
        </View>
      ))}

    </View>
  );
}