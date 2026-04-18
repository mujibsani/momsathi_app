import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: "#F6F8FF",
      padding: 20,
      justifyContent: "center"
    }}>

      {/* App Title */}
      <Text style={{
        fontSize: 34,
        fontWeight: "bold",
        color: "#2D3A8C"
      }}>
        MomSathi 🤱
      </Text>

      <Text style={{
        fontSize: 16,
        marginTop: 8,
        color: "#555"
      }}>
        Your pregnancy care companion
      </Text>

      {/* Card */}
      <View style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 15,
        marginTop: 30,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
      }}>

        <Text style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 10
        }}>
          How are you feeling today?
        </Text>

        <Text style={{ color: "#666" }}>
          Get instant guidance, exercises and safety advice.
        </Text>

      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Check Health")}
        style={{
          marginTop: 30,
          backgroundColor: "#4CAF50",
          padding: 16,
          borderRadius: 12
        }}
      >
        <Text style={{
          color: "white",
          textAlign: "center",
          fontSize: 16,
          fontWeight: "600"
        }}>
          I Feel Something
        </Text>
      </TouchableOpacity>

    </View>
  );
}