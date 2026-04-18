import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [week, setWeek] = useState(20);

  /* ---------- LOAD SAVED WEEK ---------- */
  useEffect(() => {
    loadWeek();
  }, []);

  const loadWeek = async () => {
    try {
      const savedWeek = await AsyncStorage.getItem("pregnancy_week");
      if (savedWeek !== null) {
        setWeek(parseInt(savedWeek));
      }
    } catch (e) {
      console.log("Load error:", e);
    }
  };

  /* ---------- SAVE WEEK ---------- */
  const saveWeek = async (newWeek) => {
    try {
      setWeek(newWeek);
      await AsyncStorage.setItem("pregnancy_week", newWeek.toString());
    } catch (e) {
      console.log("Save error:", e);
    }
  };

  /* ---------- TRIMESTER LOGIC ---------- */
  const getTrimester = (w) => {
    if (w <= 12) return "1st Trimester";
    if (w <= 27) return "2nd Trimester";
    return "3rd Trimester";
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F6F8FF",
        padding: 20,
        justifyContent: "center"
      }}
    >

      {/* APP TITLE */}
      <Text style={{ fontSize: 34, fontWeight: "bold", color: "#2D3A8C" }}>
        MomSathi 🤱
      </Text>

      <Text style={{ fontSize: 16, marginTop: 6, color: "#555" }}>
        Your pregnancy care companion
      </Text>

      {/* PREGNANCY STATUS CARD */}
      <View
        style={{
          backgroundColor: "white",
          padding: 18,
          borderRadius: 15,
          marginTop: 25,
          elevation: 4
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          🤱 Pregnancy Status
        </Text>

        <Text style={{ marginTop: 6, color: "#555" }}>
          Week: {week}
        </Text>

        <Text style={{ marginTop: 6, color: "#4CAF50", fontWeight: "bold" }}>
          {getTrimester(week)}
        </Text>
      </View>

      {/* WEEK UPDATE BUTTON */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ marginBottom: 6 }}>
          Update Pregnancy Week:
        </Text>

        <TouchableOpacity
          onPress={() => saveWeek(week + 1)}
          style={{
            backgroundColor: "#2D3A8C",
            padding: 12,
            borderRadius: 10
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            + Increase Week
          </Text>
        </TouchableOpacity>
      </View>

      {/* INFO CARD */}
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 15,
          marginTop: 30,
          elevation: 5
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          How are you feeling today?
        </Text>

        <Text style={{ color: "#666" }}>
          Get instant guidance, safe exercises and pregnancy advice based on your stage.
        </Text>
      </View>

      {/* MAIN ACTION BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Symptoms")}
        style={{
          marginTop: 30,
          backgroundColor: "#4CAF50",
          padding: 16,
          borderRadius: 12
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" }}>
          Get Health Advice
        </Text>
      </TouchableOpacity>

    </View>
  );
}