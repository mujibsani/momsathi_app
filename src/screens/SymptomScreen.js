import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import AppContainer from "../components/AppContainer";
import ResultCard from "../components/ResultCard";

import { analyzeSymptom } from "../engine/symptomEngine";
import { addHistory, subscribeHistory } from "../services/historyApi";

import API from "../services/api";

import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";

import { calculateWeek } from "../utils/pregnancy";

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#F6F8FF",
  card: "#FFFFFF",
  primary: "#2D3A8C",
  sub: "#666",
  danger: "#E53935"
};

export default function SymptomScreen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [recent, setRecent] = useState([]);

  const lastClickRef = useRef(null);

  /* ---------------- LOAD USER (FIRESTORE) ---------------- */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUser(snap.data());
        }
      } catch (e) {
        console.log("USER LOAD ERROR:", e);
      }
    };

    loadUser();
  }, []);

  /* ---------------- AUTO PREGNANCY WEEK ---------------- */
  const week = useMemo(() => {
    if (!user) return 1;

    if (user.pregnancyStartDate) {
      return calculateWeek(user.pregnancyStartDate);
    }

    if (user.initialWeek) {
      return user.initialWeek;
    }

    return user.pregnancyWeek || 1;
  }, [user]);

  /* ---------------- REALTIME HISTORY ---------------- */
  useEffect(() => {
    const unsub = subscribeHistory((data) => {
      if (!data) return;
      setRecent(data.slice(0, 5));
    });

    return () => unsub && unsub();
  }, []);

  /* ---------------- SYMPTOMS ---------------- */
  const symptoms = [
    {
      title: "Common Symptoms",
      items: [
        { label: "Headache", slug: "headache", icon: "🧠" },
        { label: "Nausea", slug: "nausea", icon: "🤢" },
        { label: "Back Pain", slug: "back-pain", icon: "🦴" }
      ]
    },
    {
      title: "Body Changes",
      items: [
        { label: "Swelling", slug: "swelling", icon: "🦵" },
        { label: "Fatigue", slug: "fatigue", icon: "😴" },
        { label: "Dizziness", slug: "dizziness", icon: "🌀" }
      ]
    },
    {
      title: "Emotional",
      items: [
        { label: "Stress", slug: "stress", icon: "😣" },
        { label: "Mood Swings", slug: "mood-swings", icon: "🎭" }
      ]
    }
  ];

  /* ---------------- CHECK SYMPTOM ---------------- */
  const checkProblem = useCallback(
    async (slug, label) => {
      if (loading) return;

      if (lastClickRef.current === slug) return;
      lastClickRef.current = slug;

      setLoading(true);
      setResult(null);

      try {
        const res = await API.get(
          `/problems/helper/?problem=${slug}&week=${week}`
        );

        const processed = analyzeSymptom(res.data, week);

        setResult({
          ...processed,
          slug
        });

        await addHistory({
          problem: label,
          slug,
          urgency: processed.urgency || "low",
          confidence: processed.confidence || 0,
          week,
          timestamp: Date.now(),
          date: new Date().toISOString()
        });

      } catch (e) {
        console.log("API error:", e);
      } finally {
        setLoading(false);
      }
    },
    [loading, week]
  );

  /* ---------------- CARD ---------------- */
  const Card = ({ children }) => (
    <View
      style={{
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        marginTop: 12,
        elevation: 2
      }}
    >
      {children}
    </View>
  );

  return (
    <AppContainer>
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg, padding: 20 }}>

        {/* HEADER */}
        <Text style={{ fontSize: 24, fontWeight: "700", color: COLORS.primary }}>
          🧠 Symptom Checker
        </Text>

        <Text style={{ color: COLORS.sub, marginTop: 4 }}>
          Week {week} • Tap symptoms for AI analysis
        </Text>

        {/* RECENT */}
        {recent.length > 0 && (
          <Card>
            <Text style={{ fontWeight: "bold" }}>🕒 Recent Symptoms</Text>
            {recent.map((item) => (
              <Text key={item.id} style={{ marginTop: 6 }}>
                • {item.problem} ({item.urgency})
              </Text>
            ))}
          </Card>
        )}

        {/* SYMPTOMS */}
        {symptoms.map((group, index) => (
          <View key={index} style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: "700", marginBottom: 8 }}>
              {group.title}
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {group.items.map((s) => (
                <TouchableOpacity
                  key={s.slug}
                  onPress={() => checkProblem(s.slug, s.label)}
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
          </View>
        ))}

        {/* LOADING */}
        {loading && (
          <Card>
            <Text style={{ fontWeight: "bold" }}>🧠 AI analyzing...</Text>
            <Text style={{ marginTop: 6, color: COLORS.sub }}>
              Generating safe pregnancy guidance
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