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
  const [loadingDaily, setLoadingDaily] = useState(true);

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
    if (!user) return null;

    if (user.pregnancyStartDate) {
      return calculateWeek(user.pregnancyStartDate);
    }

    return user.pregnancyWeek || 1;
  }, [user]);

  const trimester = useMemo(() => {
    if (!week) return "";
    if (week <= 12) return "1st Trimester";
    if (week <= 27) return "2nd Trimester";
    return "3rd Trimester";
  }, [week]);

  /* ---------------- STORAGE KEY ---------------- */
  const storageKey = useMemo(() => {
    return uid ? `daily_${uid}` : null;
  }, [uid]);

  /* ---------------- RESET ON USER CHANGE ---------------- */
  useEffect(() => {
    setDaily(null);
    setStreak(0);
    setLoadingDaily(true);
  }, [uid]);

  /* ---------------- DAILY ENGINE ---------------- */
  useEffect(() => {
    if (!uid || !user || !week) return;

    loadDaily();
  }, [week, uid, user]);

  const loadDaily = async () => {
    try {
      if (!uid || !storageKey) return;

      setLoadingDaily(true);

      const key = `daily_${uid}`;
      const today = new Date().toDateString();

      const saved = await AsyncStorage.getItem(key);

      let newStreak = 1;

      if (saved) {
        const parsed = JSON.parse(saved);

        const lastDate = parsed.date;
        const lastStreak = parsed.streak || 1;

        const last = new Date(lastDate);
        const now = new Date(today);

        const diffDays = Math.floor(
          (now - last) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
          setDaily(parsed.data);
          setStreak(lastStreak);
          setLoadingDaily(false);
          return;
        }

        if (diffDays === 1) {
          newStreak = lastStreak + 1;
        }

        if (diffDays > 1) {
          newStreak = 1;
        }

        // FIX: no recursion anymore
        if (parsed.week !== Number(week)) {
          await AsyncStorage.removeItem(key);
        }
      }

      const newDaily = getDailyUpdate(week, newStreak);

      setDaily(newDaily);
      setStreak(newStreak);
      setLoadingDaily(false);

      await AsyncStorage.setItem(
        key,
        JSON.stringify({
          date: today,
          week: Number(week),
          data: newDaily,
          streak: newStreak
        })
      );

    } catch (e) {
      console.log(e);
      setLoadingDaily(false);
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

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setDaily(null);
    setStreak(0);
    setLoadingDaily(true);
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

  /* ---------------- FLASH SCREEN ---------------- */
  if (loadingDaily || !user || week === null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#2D3A8C",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "900", color: "#fff" }}>
          🤱 Nurtura
        </Text>

        <Text style={{ marginTop: 10, color: "#EEF1FF" }}>
          Loading your pregnancy journey...
        </Text>

        <Text style={{ marginTop: 6, color: "#C7D2FE" }}>
          AI preparing daily insights
        </Text>
      </View>
    );
  }

  return (
    <AppContainer>
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>

        {/* HEADER */}
        <View style={{ padding: 18, paddingBottom: 10 }}>
          <Text style={{ fontSize: 30, fontWeight: "800", color: COLORS.primary }}>
            🤱 Nurtura
          </Text>

          <Text style={{ color: COLORS.sub, marginTop: 4 }}>
            Your pregnancy companion
          </Text>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ color: COLORS.danger, fontWeight: "600", marginTop: 6 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >

          {/* WEEK CARD */}
          <Card style={{ backgroundColor: COLORS.accent }}>
            <Text style={{ color: COLORS.sub }}>Current Week</Text>

            <Text style={{ fontSize: 48, fontWeight: "900", color: COLORS.primary }}>
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
          <Card>
            <Text style={{ fontSize: 16, fontWeight: "800", color: COLORS.primary }}>
              🌱 Today’s Baby Experience
            </Text>

            <Text style={{ marginTop: 10, color: COLORS.sub }}>
              {daily.insight}
            </Text>

            <Text style={{ marginTop: 10 }}>
              😊 Mood: {daily.mood}
            </Text>

            <Text>⚡ Energy: {daily.energy}</Text>
            <Text>🚨 Status: {daily.alertLevel}</Text>

            <Text style={{ marginTop: 12, fontWeight: "700" }}>👶 Baby</Text>
            <Text>{daily.baby}</Text>

            <Text style={{ marginTop: 12, fontWeight: "700" }}>🤰 Body</Text>
            <Text>{daily.body}</Text>
          </Card>

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

        </ScrollView>
      </View>
    </AppContainer>
  );
}