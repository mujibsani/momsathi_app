import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";

import { sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import AppContainer from "../components/AppContainer";

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#F3F5FF",
  primary: "#5B6CFF",
  card: "#FFFFFF",
  text: "#1A1A2E",
  sub: "#7A7A90"
};

export default function VerifyScreen() {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  const user = auth.currentUser;

  /* ---------------- AUTO CHECK (FIXED) ---------------- */
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        if (!auth.currentUser) return;

        // 🔥 IMPORTANT: reload user from Firebase server
        await auth.currentUser.reload();

        // 🔥 force refresh token (IMPORTANT FIX)
        await auth.currentUser.getIdToken(true);

        if (auth.currentUser.emailVerified) {
          clearInterval(intervalRef.current);

          console.log("✅ EMAIL VERIFIED - APP WILL AUTO SWITCH VIA AUTH LISTENER");

          // DO NOTHING HERE
          // App.js onAuthStateChanged will handle navigation
        }
      } catch (e) {
        console.log("VERIFY CHECK ERROR:", e);
      }
    }, 3000); // faster check = smoother UX

    return () => clearInterval(intervalRef.current);
  }, []);

  /* ---------------- RESEND EMAIL ---------------- */
  const handleResend = async () => {
    if (!auth.currentUser || cooldown > 0) return;

    try {
      setLoading(true);

      await sendEmailVerification(auth.currentUser);

      Alert.alert("Sent", "Verification email sent");

      setCooldown(30);

      timerRef.current = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MANUAL CHECK ---------------- */
  const handleContinue = async () => {
    try {
      setLoading(true);

      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);

      if (auth.currentUser.emailVerified) {
        Alert.alert("Verified", "Email verified successfully!");

        // ❌ DO NOT navigate manually
        // App.js will switch automatically
      } else {
        Alert.alert(
          "Not Verified",
          "Please click the link in your email first."
        );
      }
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.bg,
          justifyContent: "center",
          padding: 24
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 24,
            padding: 24,
            elevation: 6
          }}
        >

          <Text style={{ fontSize: 50, textAlign: "center" }}>📩</Text>

          <Text style={{
            fontSize: 22,
            fontWeight: "800",
            textAlign: "center",
            marginTop: 10,
            color: COLORS.text
          }}>
            Verify Your Email
          </Text>

          <Text style={{
            textAlign: "center",
            marginTop: 10,
            color: COLORS.sub
          }}>
            We sent a verification link to:
          </Text>

          <Text style={{
            textAlign: "center",
            marginTop: 6,
            fontWeight: "bold",
            color: COLORS.primary
          }}>
            {user?.email}
          </Text>

          <Text style={{
            textAlign: "center",
            marginTop: 10,
            color: COLORS.sub
          }}>
            After verifying, you will be redirected automatically.
          </Text>

          {/* BUTTON */}
          <TouchableOpacity
            onPress={handleContinue}
            style={{
              marginTop: 20,
              backgroundColor: COLORS.primary,
              padding: 16,
              borderRadius: 16
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "700"
              }}>
                I Verified → Continue
              </Text>
            )}
          </TouchableOpacity>

          {/* RESEND */}
          <TouchableOpacity onPress={handleResend} style={{ marginTop: 15 }}>
            <Text style={{
              textAlign: "center",
              color: cooldown > 0 ? "#aaa" : COLORS.primary
            }}>
              {cooldown > 0
                ? `Resend email in ${cooldown}s`
                : "Resend verification email"}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </AppContainer>
  );
}