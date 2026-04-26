import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { getHistory } from "../services/history";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getHistory();
    setHistory(data || []);
  };

  /* ---------------- BASIC STATS ---------------- */

  const total = history.length;

  const highUrgency = history.filter(
    (i) => i.urgency === "high"
  ).length;

  const normalUrgency = history.filter(
    (i) => i.urgency === "normal"
  ).length;

  /* ---------------- HEALTH SCORE ---------------- */

  const healthScore =
    total === 0 ? 100 : Math.max(100 - highUrgency * 15, 40);

  /* ---------------- LAST 7 DAYS DATA ---------------- */

  const getLast7DaysData = () => {
    const days = [];
    const counts = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      days.push(label);

      const count = history.filter(
        (item) =>
          item.date === d.toLocaleDateString()
      ).length;

      counts.push(count);
    }

    return { days, counts };
  };

  const chartData = getLast7DaysData();

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#F6F8FF"
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        📊 Health Dashboard
      </Text>

      {/* LINE CHART */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
          📈 Last 7 Days Activity
        </Text>

        <LineChart
          data={{
            labels: chartData.days,
            datasets: [{ data: chartData.counts }]
          }}
          width={screenWidth - 40}
          height={220}
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(45, 58, 140, ${opacity})`,
            labelColor: () => "#333"
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* STATS */}
      <View style={card}>
        <Text style={title}>Total Logs</Text>
        <Text style={value}>{total}</Text>
      </View>

      <View style={card}>
        <Text style={title}>High Urgency</Text>
        <Text style={value}>{highUrgency}</Text>
      </View>

      <View style={card}>
        <Text style={title}>Normal Urgency</Text>
        <Text style={value}>{normalUrgency}</Text>
      </View>

      <View style={card}>
        <Text style={title}>Health Score</Text>
        <Text style={value}>{healthScore}/100</Text>
      </View>

      {/* weekly report  */}
        <View style={report_style}>
            <TouchableOpacity
                onPress={() => navigation.navigate("WeeklyReport")}
                style={{
                backgroundColor: "#2D3A8C",
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
                elevation: 3,
                
                }}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                📅 View Weekly Report
                </Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const report_style = {
  marginTop: 15,
  padding: 20,
  borderRadius: 12
};

const card = {
  marginTop: 15,
  padding: 20,
  backgroundColor: "white",
  borderRadius: 12
};
const title = {
  fontSize: 14,
  color: "#666"
};

const value = {
  fontSize: 20,
  fontWeight: "bold",
  marginTop: 5
};