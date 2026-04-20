import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { getHistory } from "../services/history";
import { getUrgencyColor } from "../utils/colors";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        📊 Symptom History
      </Text>

      {history.length === 0 && (
        <Text style={{ marginTop: 20 }}>
          No history yet
        </Text>
      )}

      {history.map((item, i) => (
        <View
          key={i}
          style={{
            marginTop: 15,
            padding: 15,
            backgroundColor: "white",
            borderRadius: 12,
            borderLeftWidth: 5,
            borderLeftColor: getUrgencyColor(item.urgency)
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            {item.problem}
          </Text>

          <Text style={{ color: "#666" }}>
            {item.date}
          </Text>

          <Text style={{ color: getUrgencyColor(item.urgency) }}>
            {item.urgency}
          </Text>
        </View>
      ))}

    </ScrollView>
  );
}