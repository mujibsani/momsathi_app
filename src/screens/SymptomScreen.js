import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "../services/api";
import SymptomCard from "../components/SymptomCard";
import ResultCard from "../components/ResultCard";

import { useHistoryStore } from "../store/useHistoryStore";
import { analyzeSymptom } from "../engine/symptomEngine";

export default function SymptomScreen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [week, setWeek] = useState(20);

  // const addHistory = useAppStore((state) => state.addHistory);
  const addHistory = useHistoryStore((state)=> state.addHistory);
  /* ---------------- SYMPTOMS ---------------- */
  const symptoms = [
    { label: "Back Pain", slug: "back-pain", icon: "🦴", category: "Body Pain" },
    { label: "Headache", slug: "headache", icon: "🧠", category: "Pain" },
    { label: "Swelling", slug: "swelling", icon: "🦵", category: "Body Changes" },
    { label: "Stress", slug: "stress", icon: "😣", category: "Mental" },
    { label: "Nausea", slug: "nausea", icon: "🤢", category: "Digestion" }
  ];

  /* ---------------- LOAD WEEK ---------------- */
  useEffect(() => {
    const loadWeek = async () => {
      try {
        const saved = await AsyncStorage.getItem("pregnancy_week");
        setWeek(saved ? parseInt(saved) : 20);
      } catch (e) {
        console.log("Week load error:", e);
        setWeek(20);
      }
    };

    loadWeek();
  }, []);

  /* ---------------- API CALL ---------------- */
  const checkProblem = useCallback(async (slug) => {
    if (loading || !week) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await API.get(
        `/problems/helper/?problem=${slug}&week=${week}`
      );

      const processed = analyzeSymptom(res.data, week);

      setResult(processed);

      // ✅ GLOBAL STATE SAVE
      await addHistory({
        problem: processed.problem,
        urgency: processed.urgency,
        date: new Date().toLocaleDateString()
      });

    } catch (err) {
      console.log("API error:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, week]);

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#F6F8FF"
      }}
    >

      {/* HEADER */}
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        What are you feeling?
      </Text>

      <Text style={{ marginBottom: 20, color: "#666" }}>
        Tap a symptom to get instant guidance
      </Text>

      {/* SYMPTOMS */}
      {symptoms.map((item) => (
        <SymptomCard
          key={item.slug}
          label={item.label}
          icon={item.icon}
          category={item.category}
          onPress={() => checkProblem(item.slug)}
        />
      ))}

      {/* WELCOME */}
      {!loading && !result && (
        <View
          style={{
            marginTop: 30,
            padding: 20,
            backgroundColor: "#F0F5FF",
            borderRadius: 12
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            👋 Welcome to MomSathi
          </Text>

          <Text style={{ marginTop: 5, color: "#555" }}>
            Tap a symptom to get safe pregnancy guidance
          </Text>
        </View>
      )}

      {/* LOADING */}
      {loading && (
        <View
          style={{
            marginTop: 20,
            backgroundColor: "white",
            padding: 20,
            borderRadius: 15,
            elevation: 5,
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            🧠 Analyzing your symptoms
          </Text>

          <Text style={{ marginTop: 6, color: "#666" }}>
            Please wait, preparing safe guidance...
          </Text>
        </View>
      )}

      {/* RESULT */}
      {result && <ResultCard result={result} />}

    </ScrollView>
  );
}