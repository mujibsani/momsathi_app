import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Pressable
} from "react-native";

import ResultCard from "../components/ResultCard";
import { analyzeSymptom } from "../engine/symptomEngine";
import { calculateWeek } from "../utils/pregnancy";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { subscribeHistory } from "../services/historyApi";

/* ---------------- CONSTANTS ---------------- */
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SNAP_TOP = SCREEN_HEIGHT * 0.15;
const SNAP_MID = SCREEN_HEIGHT * 0.35;
const SNAP_BOTTOM = SCREEN_HEIGHT;

const COLORS = {
  bg: "#F8F9FF",
  card: "#FFFFFF",
  primary: "#5B6CFF",
  text: "#1A1A2E",
  sub: "#7A7A90",
};

/* ---------------- COMPONENT ---------------- */
export default function SymptomScreen() {
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const [recent, setRecent] = useState([]);

  /* ---------------- ANIMATION ---------------- */
  const translateY = useRef(new Animated.Value(SNAP_BOTTOM)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  /* ---------------- OPEN ---------------- */
  const openCard = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SNAP_MID,
        useNativeDriver: true,
        damping: 20,
        stiffness: 120,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* ---------------- CLOSE ---------------- */
  const closeCard = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SNAP_BOTTOM,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setResult(null));
  };

  /* ---------------- SNAP LOGIC ---------------- */
  const snapTo = (toValue) => {
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      damping: 20,
      stiffness: 120,
    }).start();
  };

  /* ---------------- DRAG ---------------- */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,

      onPanResponderMove: (_, gesture) => {
        const newY = SNAP_MID + gesture.dy;
        translateY.setValue(newY);
      },

      onPanResponderRelease: (_, gesture) => {
        const velocity = gesture.vy;

        if (gesture.dy > 150 || velocity > 1.2) {
          closeCard(); // 👇 swipe down fast
        } else if (gesture.dy < -120) {
          snapTo(SNAP_TOP); // 👆 expand
        } else {
          snapTo(SNAP_MID); // 🔁 default
        }
      },
    })
  ).current;

  /* ---------------- USER ---------------- */
  useEffect(() => {
    const load = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setUser(snap.data());
    };

    load();
  }, []);

  const week = useMemo(() => {
    if (!user) return 1;
    return user.pregnancyStartDate
      ? calculateWeek(user.pregnancyStartDate)
      : user.pregnancyWeek || 1;
  }, [user]);

  /* ---------------- HISTORY ---------------- */
  useEffect(() => {
    const unsub = subscribeHistory((d) => setRecent(d || []));
    return () => unsub && unsub();
  }, []);

  /* ---------------- SYMPTOMS ---------------- */
  const groups = [
    {
      title: "Common",
      items: [
        { label: "Headache", slug: "headache", icon: "🧠" },
        { label: "Nausea", slug: "nausea", icon: "🤢" },
        { label: "Fatigue", slug: "fatigue", icon: "😴" },
      ],
    },
    {
      title: "Body",
      items: [
        { label: "Swelling", slug: "swelling", icon: "🦵" },
        { label: "Back Pain", slug: "back-pain", icon: "🦴" },
        { label: "Dizziness", slug: "dizziness", icon: "🌀" },
      ],
    },
    {
      title: "Other",
      items: [
        { label: "Fever", slug: "fever", icon: "🤒" },
        { label: "Vomiting", slug: "vomiting", icon: "🤮" },
      ],
    },
  ];

  /* ---------------- ACTION ---------------- */
  const check = (slug, label) => {
    const res = analyzeSymptom({
      symptoms: [slug],
      week,
      streak: 1,
    });

    setResult({ ...res, label });

    // reset position before opening
    translateY.setValue(SNAP_BOTTOM);
    openCard();
  };

  /* ---------------- UI ---------------- */
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        
        {/* HEADER */}
        <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.text }}>
          🧠 Symptom Check
        </Text>

        <Text style={{ color: COLORS.sub, marginTop: 4 }}>
          Week {week} • AI-powered guidance
        </Text>

        {/* WEEK CARD */}
        <View
          style={{
            backgroundColor: "#EEF1FF",
            padding: 20,
            borderRadius: 20,
            marginTop: 16,
          }}
        >
          <Text style={{ color: COLORS.sub }}>Your Pregnancy Week</Text>
          <Text style={{ fontSize: 40, fontWeight: "900", color: COLORS.primary }}>
            {week}
          </Text>
        </View>

        {/* RECENT */}
        {recent.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "700" }}>Recent</Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
              {recent.slice(0, 4).map((r) => (
                <View
                  key={r.id}
                  style={{
                    backgroundColor: "#fff",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 12 }}>{r.problem}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* GROUPS */}
        {groups.map((g, i) => (
          <View key={i} style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "700", marginBottom: 10 }}>
              {g.title}
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {g.items.map((s) => (
                <TouchableOpacity
                  key={s.slug}
                  onPress={() => check(s.slug, s.label)}
                  style={{
                    width: "47%",
                    backgroundColor: COLORS.card,
                    padding: 18,
                    borderRadius: 18,
                    margin: "1.5%",
                    elevation: 3,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{s.icon}</Text>
                  <Text style={{ marginTop: 8, fontWeight: "600" }}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* BACKDROP */}
      {result && (
        <>
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.35)",
              opacity: backdropOpacity,
            }}
          >
            <Pressable style={{ flex: 1 }} onPress={closeCard} />
          </Animated.View>

          {/* FLOATING SHEET */}
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: SCREEN_HEIGHT,
              transform: [{ translateY }],
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 16,
                flex: 1,
              }}
            >
              {/* DRAG HANDLE */}
              <View
                style={{
                  width: 40,
                  height: 5,
                  backgroundColor: "#ccc",
                  borderRadius: 3,
                  alignSelf: "center",
                  marginBottom: 10,
                }}
              />

              <ResultCard result={result} onClose={closeCard} />
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}