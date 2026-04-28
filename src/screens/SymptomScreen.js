import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppContainer from "../components/AppContainer";

import API from "../services/api";
import ResultCard from "../components/ResultCard";
import { useHistoryStore } from "../store/useHistoryStore";
import { analyzeSymptom } from "../engine/symptomEngine";

const COLORS = {
  bg: "#F6F8FF",
  card: "#FFFFFF",
  primary: "#2D3A8C",
  subtext: "#666",
  danger: "#E53935"
};

export default function SymptomScreen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [week, setWeek] = useState(20);

  const addHistory = useHistoryStore((s) => s.addHistory);

  useEffect(() => {
    const loadWeek = async () => {
      const saved = await AsyncStorage.getItem("pregnancy_week");
      setWeek(saved ? parseInt(saved) : 20);
    };
    loadWeek();
  }, []);

  const symptoms = [
    { label: "Back Pain", slug: "back-pain", icon: "🦴" },
    { label: "Headache", slug: "headache", icon: "🧠" },
    { label: "Swelling", slug: "swelling", icon: "🦵" },
    { label: "Stress", slug: "stress", icon: "😣" },
    { label: "Nausea", slug: "nausea", icon: "🤢" }
  ];

  const checkProblem = useCallback(async (slug) => {
    if (loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await API.get(
        `/problems/helper/?problem=${slug}&week=${week}`
      );

      const processed = analyzeSymptom(res.data, week);
      setResult(processed);

      await addHistory({
        problem: processed.problem,
        urgency: processed.urgency,
        date: new Date().toLocaleDateString()
      });

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [loading, week]);

  const Card = ({ children }) => (
    <View
      style={{
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        marginTop: 12,
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
      <Text style={{ fontSize: 22, fontWeight: "bold", color: COLORS.primary }}>
        🧠 Symptom Checker
      </Text>

      <Text style={{ color: COLORS.subtext, marginTop: 5 }}>
        Tap a symptom for AI guidance
      </Text>

      {/* SYMPTOMS GRID */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 15 }}>

        {symptoms.map((s) => (
          <TouchableOpacity
            key={s.slug}
            onPress={() => checkProblem(s.slug)}
            style={{
              backgroundColor: "#fff",
              padding: 14,
              borderRadius: 14,
              margin: 6,
              width: "45%",
              alignItems: "center",
              elevation: 2
            }}
          >
            <Text style={{ fontSize: 22 }}>{s.icon}</Text>
            <Text style={{ marginTop: 5, fontWeight: "600" }}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}

      </View>

      {/* LOADING */}
      {loading && (
        <Card>
          <Text style={{ fontWeight: "bold" }}>
            🧠 AI analyzing symptom...
          </Text>
          <Text style={{ marginTop: 5, color: COLORS.subtext }}>
            Generating safe pregnancy advice
          </Text>
        </Card>
      )}

      {/* RESULT */}
      {result && (
        <View style={{ marginTop: 15 }}>
          <ResultCard result={result} />
        </View>
      )}

    </ScrollView>
    </AppContainer>
  );
}