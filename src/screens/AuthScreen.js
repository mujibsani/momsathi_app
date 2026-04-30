import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";

import { loginUser, registerUser } from "../services/authService";

const COLORS = {
  bg: "#F6F8FF",
  primary: "#2D3A8C",
  card: "#FFFFFF",
  sub: "#666"
};

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ---------------- INPUT REFS ---------------- */
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const confirmRef = useRef(null);

  /* ---------------- AUTH ---------------- */
  const handleAuth = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanEmail || !cleanPass) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (mode === "register" && cleanPass !== cleanConfirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (cleanPass.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await loginUser(cleanEmail, cleanPass);
      } else {
        await registerUser(cleanEmail, cleanPass);
      }

      Alert.alert("Success", "Authentication successful");
    } catch (error) {
      Alert.alert("Auth Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20
        }}
      >
        {/* TITLE */}
        <Text style={{ fontSize: 32, fontWeight: "bold", color: COLORS.primary }}>
          Nurtura
        </Text>

        <Text style={{ color: COLORS.sub, marginBottom: 30 }}>
          AI Pregnancy Health Companion
        </Text>

        {/* EMAIL */}
        <TextInput
          ref={emailRef}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passRef.current?.focus()}
          style={{
            backgroundColor: COLORS.card,
            padding: 14,
            borderRadius: 12,
            marginBottom: 12
          }}
        />

        {/* PASSWORD */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            marginBottom: 12
          }}
        >
          <TextInput
            ref={passRef}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType={mode === "register" ? "next" : "done"}
            blurOnSubmit={false}
            onSubmitEditing={() =>
              mode === "register"
                ? confirmRef.current?.focus()
                : handleAuth()
            }
            style={{ flex: 1, padding: 14 }}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONFIRM PASSWORD (REGISTER ONLY) */}
        {mode === "register" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.card,
              borderRadius: 12,
              paddingHorizontal: 12,
              marginBottom: 20
            }}
          >
            <TextInput
              ref={confirmRef}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              returnKeyType="done"
              onSubmitEditing={handleAuth}
              style={{ flex: 1, padding: 14 }}
            />

            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
                {showConfirm ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
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
          onPress={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          style={{ marginTop: 20 }}
        >
          <Text style={{ textAlign: "center", color: COLORS.primary }}>
            {mode === "login"
              ? "Create new account"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}