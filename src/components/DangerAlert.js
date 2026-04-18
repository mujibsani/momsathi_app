import React from "react";
import { View, Text } from "react-native";

export default function DangerAlert({ warning }) {
  return (
    <View
      style={{
        backgroundColor: "#FFF1F0",
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FF4D4F",
        marginTop: 15
      }}
    >
      <Text style={{ color: "#FF4D4F", fontWeight: "bold" }}>
        🚨 Immediate Attention Needed
      </Text>

      <Text style={{ marginTop: 5, color: "#333" }}>
        {warning}
      </Text>

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Please contact a doctor or visit a hospital immediately.
      </Text>
    </View>
  );
}