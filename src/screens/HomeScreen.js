import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppContainer from "../components/AppContainer";

const COLORS = {
  bg: "#F6F8FF",
  card: "#FFFFFF",
  primary: "#2D3A8C",
  success: "#4CAF50",
  text: "#222",
  subtext: "#666"
};

export default function HomeScreen({ navigation }) {
  const [week, setWeek] = useState(20);

  useEffect(() => {
    loadWeek();
  }, []);

  const loadWeek = async () => {
    const saved = await AsyncStorage.getItem("pregnancy_week");
    if (saved) setWeek(parseInt(saved));
  };

  const saveWeek = async (w) => {
    setWeek(w);
    await AsyncStorage.setItem("pregnancy_week", w.toString());
  };

  const getTrimester = (w) => {
    if (w <= 12) return "1st Trimester";
    if (w <= 27) return "2nd Trimester";
    return "3rd Trimester";
  };

  const Card = ({ children }) => (
    <View
      style={{
        backgroundColor: COLORS.card,
        padding: 18,
        borderRadius: 16,
        marginTop: 15,
        elevation: 3
      }}
    >
      {children}
    </View>
  );

  return (
    <AppContainer>
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg, padding: 20 }}>

      {/* HEADER */}
      <Text style={{ fontSize: 28, fontWeight: "bold", color: COLORS.primary }}>
        🤱 MomSathi
      </Text>

      <Text style={{ color: COLORS.subtext, marginTop: 5 }}>
        Pregnancy care companion
      </Text>

      {/* STATUS CARD */}
      <Card>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Pregnancy Status
        </Text>

        <Text style={{ marginTop: 8, color: COLORS.subtext }}>
          Week: {week}
        </Text>

        <Text style={{ marginTop: 6, color: COLORS.success, fontWeight: "bold" }}>
          {getTrimester(week)}
        </Text>
      </Card>

      {/* ACTION CARD */}
      <Card>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Weekly Progress
        </Text>

        <Text style={{ marginTop: 6, color: COLORS.subtext }}>
          Update your pregnancy week for better AI guidance
        </Text>

        <TouchableOpacity
          onPress={() => saveWeek(week + 1)}
          style={{
            marginTop: 12,
            backgroundColor: COLORS.primary,
            padding: 12,
            borderRadius: 12
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            + Increase Week
          </Text>
        </TouchableOpacity>
      </Card>

      {/* INFO CARD */}
      <Card>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          AI Health Support
        </Text>

        <Text style={{ marginTop: 6, color: COLORS.subtext }}>
          Get personalized pregnancy advice, safe exercises and symptom help.
        </Text>
      </Card>

      {/* CTA */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Symptoms")}
        style={{
          marginTop: 25,
          backgroundColor: COLORS.success,
          padding: 16,
          borderRadius: 16,
          alignItems: "center",
          elevation: 3
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          🧠 Check Symptoms
        </Text>
      </TouchableOpacity>

    </ScrollView>
    </AppContainer>
  );
}