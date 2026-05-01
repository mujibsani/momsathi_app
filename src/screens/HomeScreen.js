import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import AppContainer from "../components/AppContainer";
import { logoutUser } from "../services/authService";

import {
  doc,
  onSnapshot,
  setDoc
} from "firebase/firestore";

import { db, auth } from "../services/firebase";
import { calculateWeek } from "../utils/pregnancy";
import { getDailyUpdate } from "../engine/dailyEngine";

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#F6F8FF",
  card: "#FFFFFF",
  primary: "#2D3A8C",
  success: "#4CAF50",
  danger: "#E53935",
  text: "#1E1E2D",
  sub: "#6C6C80"
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
      if (snap.exists()) setUser(snap.data());
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

  /* ---------------- USER-SAFE STORAGE KEY (IMPORTANT FIX) */
  const getStorageKey = useCallback(() => {
    return uid ? `daily_data_${uid}` : "daily_data_guest";
  }, [uid]);

  /* ---------------- DAILY ENGINE (FIXED) ---------------- */
  useEffect(() => {
    loadDaily();
  }, [week, uid]);

  const loadDaily = async () => {
    try {
      if (!uid) return;

      const todayKey = new Date().toDateString();
      const storageKey = getStorageKey();

      const saved = await AsyncStorage.getItem(storageKey);

      // reuse same day + same user
      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed.date === todayKey && parsed.week === week) {
          setDaily(parsed.data);
          setStreak(parsed.streak || 1);
          return;
        }
      }

      // generate fresh for new user/week/day
      const newDaily = getDailyUpdate(week);

      const newStreak = saved ? (JSON.parse(saved).streak || 0) + 1 : 1;

      setDaily(newDaily);
      setStreak(newStreak);

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({
          date: todayKey,
          week,
          data: newDaily,
          streak: newStreak
        })
      );

    } catch (e) {
      console.log("DAILY ERROR:", e);
    }
  };

  /* ---------------- UPDATE WEEK ---------------- */
  const updateWeek = async (newWeek) => {
    try {
      if (!uid) return;

      const ref = doc(db, "users", uid);

      await setDoc(
        ref,
        {
          pregnancyWeek: Number(newWeek),
          lastUpdated: new Date().toISOString()
        },
        { merge: true }
      );

    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  /* ---------------- TRIMESTER ---------------- */
  const getTrimester = (w) => {
    if (w <= 12) return "1st Trimester";
    if (w <= 27) return "2nd Trimester";
    return "3rd Trimester";
  };

  /* ---------------- LOGOUT (IMPORTANT FIX) ---------------- */
  const handleLogout = async () => {
    Alert.alert("Logout", "Do you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logoutUser();

          // IMPORTANT: clear local state
          setUser(null);
          setDaily(null);
          setStreak(0);
        }
      }
    ]);
  };

  return (
    <AppContainer>
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg, padding: 20 }}>

        {/* HEADER */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.primary }}>
              🤱 Nurtura
            </Text>
            <Text style={{ color: COLORS.sub, marginTop: 4 }}>
              Your daily pregnancy companion
            </Text>
          </View>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ color: COLORS.danger, fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* STATUS */}
        <View
          style={{
            backgroundColor: COLORS.card,
            padding: 20,
            borderRadius: 20,
            marginTop: 20,
            elevation: 4
          }}
        >
          <Text style={{ color: COLORS.sub }}>Current Week</Text>

          <Text style={{ fontSize: 44, fontWeight: "800", color: COLORS.primary }}>
            {week}
          </Text>

          <Text style={{ color: COLORS.success, fontWeight: "600" }}>
            {getTrimester(week)}
          </Text>

          {/* WEEK CONTROL */}
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <TouchableOpacity
              onPress={() => updateWeek(Math.max(1, week - 1))}
              style={{
                flex: 1,
                backgroundColor: "#BDC3FF",
                padding: 10,
                borderRadius: 10,
                marginRight: 6
              }}
            >
              <Text style={{ textAlign: "center" }}>–</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => updateWeek(Math.min(42, week + 1))}
              style={{
                flex: 1,
                backgroundColor: COLORS.primary,
                padding: 10,
                borderRadius: 10
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DAILY CARD */}
        {daily && (
          <View
            style={{
              backgroundColor: COLORS.card,
              padding: 18,
              borderRadius: 18,
              marginTop: 15,
              elevation: 4
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.primary }}>
              🌱 Today’s Baby Update
            </Text>

            <Text style={{ marginTop: 12, fontWeight: "600" }}>👶 Baby</Text>
            <Text style={{ marginTop: 4 }}>{daily.baby}</Text>

            <Text style={{ marginTop: 12, fontWeight: "600" }}>🤰 Body</Text>
            <Text style={{ marginTop: 4 }}>{daily.body}</Text>

            <Text style={{ marginTop: 12, fontWeight: "600" }}>💡 Tips</Text>

            {daily.tips?.map((tip, i) => (
              <Text key={i} style={{ marginTop: 6 }}>
                • {tip}
              </Text>
            ))}
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Symptoms")}
          style={{
            marginTop: 25,
            backgroundColor: COLORS.success,
            padding: 18,
            borderRadius: 18,
            alignItems: "center",
            elevation: 4
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            🧠 Check Symptoms
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </AppContainer>
  );
}