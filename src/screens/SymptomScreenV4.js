import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import AppContainer from "../components/AppContainer";
import { analyzeSymptomV4 } from "../engine/symptomEngine.v4";
import ResultCardV4 from "../components/ResultCardV4";

export default function SymptomScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const symptoms = [
    { label: "Chest Pain", slug: "chest pain" },
    { label: "Bleeding", slug: "bleeding" },
    { label: "Headache", slug: "headache" },
    { label: "Dizziness", slug: "dizziness" },
  ];

  const check = async (slug) => {
    setLoading(true);

    const result = analyzeSymptomV4({
      symptoms: [slug],
      week: 20,
      streak: 2,
    });

    setData(result);
    setLoading(false);
  };

  return (
    <AppContainer>
      <ScrollView style={{ flex: 1, padding: 16 }}>

        <Text style={{ fontSize: 22, fontWeight: "800" }}>
          🚨 Emergency Symptom AI v4
        </Text>

        {/* SYMPTOMS */}
        {symptoms.map((s) => (
          <TouchableOpacity
            key={s.slug}
            onPress={() => check(s.slug)}
            style={{
              padding: 14,
              backgroundColor: "#fff",
              marginTop: 10,
              borderRadius: 12,
            }}
          >
            <Text>{s.label}</Text>
          </TouchableOpacity>
        ))}

        {/* LOADING */}
        {loading && (
          <Text style={{ marginTop: 10 }}>
            🧠 Analyzing emergency risk...
          </Text>
        )}

        {/* RESULT */}
        <ResultCardV4 data={data} />

      </ScrollView>
    </AppContainer>
  );
}