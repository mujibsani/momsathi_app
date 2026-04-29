import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

import { loginUser, registerUser } from "../services/authService";

const COLORS = {
  bg: "#F6F8FF",
  primary: "#2D3A8C",
  card: "#FFFFFF",
  text: "#222",
  sub: "#666"
};

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);

  /* ---------------- HANDLE AUTH ---------------- */
  const handleAuth = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    /* ---------------- REGISTER VALIDATION ---------------- */
    if (mode === "register") {
      if (cleanPassword !== cleanConfirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      if (cleanPassword.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await loginUser(cleanEmail, cleanPassword);
      } else {
        await registerUser(cleanEmail, cleanPassword);
      }

      Alert.alert("Success", "Authentication successful");

      // reset fields after success
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.log("AUTH ERROR:", error.code, error.message);
      Alert.alert("Auth Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        padding: 20
      }}
    >
      {/* TITLE */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: COLORS.primary,
          marginBottom: 10
        }}
      >
        Nurtura
      </Text>

      <Text style={{ color: COLORS.sub, marginBottom: 30 }}>
        AI Pregnancy Health Companion
      </Text>

      {/* EMAIL */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          backgroundColor: COLORS.card,
          padding: 14,
          borderRadius: 12,
          marginBottom: 12
        }}
      />

      {/* PASSWORD */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: COLORS.card,
          padding: 14,
          borderRadius: 12,
          marginBottom: 12
        }}
      />

      {/* CONFIRM PASSWORD (ONLY REGISTER MODE) */}
      {mode === "register" && (
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{
            backgroundColor: COLORS.card,
            padding: 14,
            borderRadius: 12,
            marginBottom: 20
          }}
        />
      )}

      {/* BUTTON */}
      <TouchableOpacity
        onPress={handleAuth}
        style={{
          backgroundColor: COLORS.primary,
          padding: 14,
          borderRadius: 12,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Create Account"}
        </Text>
      </TouchableOpacity>

      {/* SWITCH MODE */}
      <TouchableOpacity
        onPress={() => {
          setMode(mode === "login" ? "register" : "login");
          setConfirmPassword("");
        }}
        style={{ marginTop: 20 }}
      >
        <Text style={{ textAlign: "center", color: COLORS.primary }}>
          {mode === "login"
            ? "Create new account"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}