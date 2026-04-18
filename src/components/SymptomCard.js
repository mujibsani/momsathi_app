import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function SymptomCard({ label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 3
      }}
    >
      <Text style={{ fontSize: 16 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}