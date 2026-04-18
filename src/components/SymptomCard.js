import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export default function SymptomCard({ label, icon, category, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>

        <Text style={{ fontSize: 24, marginRight: 10 }}>
          {icon}
        </Text>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {label}
          </Text>

          <Text style={{ fontSize: 12, color: "#777" }}>
            {category}
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}