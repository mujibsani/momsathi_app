import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import API from "../services/api";

export default function SymptomScreen() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);

  const check = async () => {
    try {
      const res = await API.get(
        `/problems/helper/?problem=${input}`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={{ padding: 20, marginTop: 40 }}>

      <Text style={{ fontSize: 18 }}>
        What are you feeling?
      </Text>

      <TextInput
        placeholder="e.g. back-pain"
        value={input}
        onChangeText={setInput}
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10
        }}
      />

      <Button title="Check" onPress={check} />

      {data && (
        <View style={{ marginTop: 20 }}>

          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {data.problem}
          </Text>

          <Text>Urgency: {data.urgency}</Text>

          <Text style={{ marginTop: 10 }}>
            {data.what_to_do}
          </Text>

          <Text style={{ marginTop: 10 }}>
            Avoid: {data.avoid}
          </Text>

          <Text style={{ marginTop: 10, fontWeight: "bold" }}>
            Exercises:
          </Text>

          {data.exercises.map((ex, i) => (
            <Text key={i}>
              • {ex.name} ({ex.duration} min)
            </Text>
          ))}

        </View>
      )}

    </ScrollView>
  );
}