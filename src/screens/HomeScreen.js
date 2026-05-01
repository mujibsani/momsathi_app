import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import AppContainer from "../components/AppContainer";
import { logoutUser } from "../services/authService";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";

import { calculateWeek } from "../utils/pregnancy";
import { getDailyUpdate } from "../engine/dailyEngine";

/* ---------------- THEME ---------------- */
const COLORS = {
  bg: "#F4F6FF",
  card: "#FFFFFF",
  primary: "#2D3A8C",
  accent: "#EEF1FF",
  success: "#22C55E",
  danger: "#EF4444",
  text: "#111827",
  sub: "#6B7280"
};

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [daily, setDaily] = useState(null);
  const [streak, setStreak] = useState(0);

  const uid = auth.currentUser?.uid;

  /* ---------------- USER LISTENER ---------------- */
  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, "users", uid);

    const unsub = onSnapshot(ref, (snap) => {
      setUser(snap.exists() ? snap.data() : null);
    });

    return () => unsub();
  }, [uid]);

  /* ---------------- WEEK ---------------- */
  const week = useMemo(() => {
    if (!user) return 1;

    if (user.pregnancyStartDate) {
      return calculateWeek(user.pregnancyStartDate);
    }

    return user.pregnancyWeek || 1;
  }, [user]);

  const trimester = useMemo(() => {
    if (week <= 12) return "1st Trimester";
    if (week <= 27) return "2nd Trimester";
    return "3rd Trimester";
  }, [week]);

  /* ---------------- STORAGE KEY (FIXED SAFETY) ---------------- */
  const storageKey = useMemo(() => {
    return uid ? `daily_${uid}` : null;
  }, [uid]);

  /* ---------------- RESET DAILY ON USER CHANGE ---------------- */
  useEffect(() => {
    setDaily(null);
    setStreak(0);
  }, [uid]);

  /* ---------------- DAILY ENGINE ---------------- */
  useEffect(() => {
    if (!uid || !storageKey) return;
    loadDaily();
  }, [week, uid]);

  const loadDaily = async () => {
    try {
      const today = new Date().toDateString();

      const saved = await AsyncStorage.getItem(storageKey);

      if (saved) {
        const parsed = JSON.parse(saved);

        // SAME USER + SAME WEEK + SAME DAY
        if (
          parsed.date === today &&
          parsed.week === week
        ) {
          setDaily(parsed.data);
          setStreak(parsed.streak || 1);
          return;
        }
      }

      // generate new daily content
      const newDaily = getDailyUpdate(week);

      const newStreak = saved
        ? (JSON.parse(saved).streak || 0) + 1
        : 1;

      setDaily(newDaily);
      setStreak(newStreak);

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({
          date: today,
          week,
          data: newDaily,
          streak: newStreak
        })
      );

    } catch (e) {
      console.log("DAILY ENGINE ERROR:", e);
    }
  };

  /* ---------------- WEEK UPDATE ---------------- */
  const updateWeek = async (newWeek) => {
    try {
      if (!uid) return;

      const ref = doc(db, "users", uid);

      await setDoc(
        ref,
        {
          pregnancyWeek: Number(newWeek),
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );

    } catch (e) {
      console.log("WEEK UPDATE ERROR:", e);
    }
  };

  /* ---------------- LOGOUT (FIXED CLEAN RESET) ---------------- */
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setDaily(null);
    setStreak(0);
  };

  /* ---------------- CARD ---------------- */
  const Card = ({ children, style }) => (
    <View
      style={[
        {
          backgroundColor: COLORS.card,
          borderRadius: 22,
          padding: 18,
          marginTop: 14,
          elevation: 5
        },
        style
      ]}
    >
      {children}
    </View>
  );

  return (
    <AppContainer>
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>

        {/* ---------------- FIXED HEADER ---------------- */}
        <View
          style={{
            padding: 18,
            paddingBottom: 10,
            backgroundColor: COLORS.bg
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "800",
              color: COLORS.primary
            }}
          >
            🤱 Nurtura
          </Text>

          <Text style={{ color: COLORS.sub, marginTop: 4 }}>
            Your pregnancy companion
          </Text>

          <TouchableOpacity onPress={handleLogout}>
            <Text
              style={{
                color: COLORS.danger,
                fontWeight: "600",
                marginTop: 6
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---------------- SCROLLABLE CONTENT ---------------- */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 18,
            paddingBottom: 120
          }}
          showsVerticalScrollIndicator={false}
        >

          {/* WEEK CARD */}
          <Card style={{ backgroundColor: COLORS.accent }}>
            <Text style={{ color: COLORS.sub }}>Current Week</Text>

            <Text
              style={{
                fontSize: 48,
                fontWeight: "900",
                color: COLORS.primary
              }}
            >
              {week}
            </Text>

            <Text style={{ fontWeight: "600", color: COLORS.success }}>
              {trimester}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <TouchableOpacity
                onPress={() => updateWeek(Math.max(1, week - 1))}
                style={{
                  flex: 1,
                  backgroundColor: "#D1D5FF",
                  padding: 12,
                  borderRadius: 14,
                  marginRight: 8
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "700" }}>−</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => updateWeek(Math.min(42, week + 1))}
                style={{
                  flex: 1,
                  backgroundColor: COLORS.primary,
                  padding: 12,
                  borderRadius: 14
                }}
              >
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "700" }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* STREAK */}
          <Card>
            <Text style={{ fontWeight: "700", fontSize: 16 }}>
              🔥 Daily Streak
            </Text>

            <Text style={{ fontSize: 28, fontWeight: "800", marginTop: 6 }}>
              {streak} days
            </Text>

            <Text style={{ color: COLORS.sub, marginTop: 4 }}>
              Keep tracking your pregnancy journey
            </Text>
          </Card>

          {/* DAILY */}
          {daily && (
            <Card>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: COLORS.primary
                }}
              >
                🌱 Today’s Baby Experience
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.primary,
                  marginTop: 4
                }}
              >
                {daily.mood}
              </Text>

              <Text style={{ marginTop: 12, fontWeight: "700" }}>👶 Baby</Text>
              <Text style={{ marginTop: 6, lineHeight: 20 }}>
                {daily.baby}
              </Text>

              <Text style={{ marginTop: 12, fontWeight: "700" }}>🤰 Body</Text>
              <Text style={{ marginTop: 6, lineHeight: 20 }}>
                {daily.body}
              </Text>

              <Text style={{ marginTop: 12, fontWeight: "700" }}>💡 Tips</Text>

              {daily.tips?.map((tip, i) => (
                <View
                  key={i}
                  style={{ flexDirection: "row", marginTop: 6 }}
                >
                  <Text style={{ marginRight: 6 }}>•</Text>
                  <Text style={{ flex: 1, lineHeight: 20 }}>
                    {tip}
                  </Text>
                </View>
              ))}
            </Card>
          )}

          {/* CTA */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Symptoms")}
            style={{
              marginTop: 22,
              backgroundColor: COLORS.success,
              padding: 18,
              borderRadius: 18,
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>
              🧠 Check Symptoms
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </AppContainer>
  );
}