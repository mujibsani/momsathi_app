import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from "react";

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

import AppContainer from "../components/AppContainer";
import ResultCard from "../components/ResultCard";

import { analyzeSymptom } from "../engine/symptomEngine";
import { addHistory, subscribeHistory } from "../services/historyApi";

import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { calculateWeek } from "../utils/pregnancy";

/* ---------------- SCREEN ---------------- */
const { height } = Dimensions.get("window");

const SNAP_BOTTOM = height;
const SNAP_MID = height * 0.45;
const SNAP_TOP = height * 0.12;

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#F6F8FF",
  primary: "#2D3A8C",
  sub: "#666",
  card: "#FFFFFF"
};

export default function SymptomScreen() {
  const [result, setResult] = useState(null);
  const [loadingSlug, setLoadingSlug] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [user, setUser] = useState(null);
  const [recent, setRecent] = useState([]);

  const translateY = useRef(new Animated.Value(SNAP_BOTTOM)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  /* ---------------- USER ---------------- */
  useEffect(() => {
    const loadUser = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setUser(snap.data());
    };

    loadUser();
  }, []);

  const week = useMemo(() => {
    if (!user) return 1;

    return user.pregnancyStartDate
      ? calculateWeek(user.pregnancyStartDate)
      : user.pregnancyWeek || 1;
  }, [user]);

  /* ---------------- HISTORY ---------------- */
  useEffect(() => {
    const unsub = subscribeHistory((data) => {
      setRecent(data || []);
    });

    return () => unsub && unsub();
  }, []);

  /* ---------------- SYMPTOMS ---------------- */
  const groups = [
    {
      title: "Common Symptoms",
      items: [
        { label: "Headache", slug: "headache", icon: "🧠" },
        { label: "Nausea", slug: "nausea", icon: "🤢" },
        { label: "Fatigue", slug: "fatigue", icon: "😴" }
      ]
    },
    {
      title: "Body Changes",
      items: [
        { label: "Swelling", slug: "swelling", icon: "🦵" },
        { label: "Back Pain", slug: "back-pain", icon: "🦴" },
        { label: "Dizziness", slug: "dizziness", icon: "🌀" }
      ]
    },
    {
      title: "Other",
      items: [
        { label: "Fever", slug: "fever", icon: "🤒" },
        { label: "Vomiting", slug: "vomiting", icon: "🤮" }
      ]
    }
  ];

  /* ---------------- OPEN SHEET ---------------- */
  const openSheet = () => {
    isOpen.current = true;

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SNAP_MID,
        useNativeDriver: true,
        damping: 18,
        stiffness: 120
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  /* ---------------- CLOSE SHEET ---------------- */
  const closeSheet = () => {
    isOpen.current = false;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SNAP_BOTTOM,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      setResult(null);
      setSelectedSlug(null);
      setLoadingSlug(null);
    });
  };

  /* ---------------- DRAG ---------------- */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,

      onPanResponderMove: (_, g) => {
        if (!isOpen.current) return;

        let newY = SNAP_MID + g.dy;

        // clamp movement so it doesn't go crazy
        if (newY < SNAP_TOP) newY = SNAP_TOP;
        if (newY > SNAP_BOTTOM) newY = SNAP_BOTTOM;

        translateY.setValue(newY);
      },

      onPanResponderRelease: (_, g) => {
        const { dy, vy } = g;

        // 🔥 FULL SCREEN SNAP
        if (dy < -120 || vy < -1.2) {
          Animated.spring(translateY, {
            toValue: SNAP_TOP,
            useNativeDriver: true,
            damping: 18,
            stiffness: 120
          }).start();
          return;
        }

        // 🔥 CLOSE
        if (dy > 160 || vy > 1.5) {
          closeSheet();
          return;
        }

        // 🔥 DEFAULT MID
        Animated.spring(translateY, {
          toValue: SNAP_MID,
          useNativeDriver: true,
          damping: 18,
          stiffness: 120
        }).start();
      }
    })
  ).current;

  /* ---------------- CHECK ---------------- */
  const check = useCallback(
    async (slug, label) => {
      setSelectedSlug(slug);
      setLoadingSlug(slug);

      const res = analyzeSymptom({
        symptoms: [slug],
        week,
        streak: 1
      });

      setResult({ ...res, label });

      await addHistory({
        problem: label,
        slug,
        urgency: res.urgency,
        riskLevel: res.riskLevel,
        week,
        timestamp: Date.now()
      });

      setLoadingSlug(null);
      openSheet();
    },
    [week]
  );

  /* ---------------- UI ---------------- */
  return (
    <AppContainer>
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>

        {/* ================= HEADER (RESTORED) ================= */}
        <View style={{ padding: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.primary }}>
            🧠 Symptom AI
          </Text>

          <Text style={{ color: COLORS.sub, marginTop: 4 }}>
            Week {week} • iOS Health-style intelligent analysis
          </Text>
        </View>

        {/* ================= CONTENT ================= */}
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>

          {/* WEEK CARD */}
          <View
            style={{
              backgroundColor: "#EEF1FF",
              padding: 20,
              borderRadius: 20
            }}
          >
            <Text style={{ color: COLORS.sub }}>Pregnancy Week</Text>
            <Text style={{ fontSize: 40, fontWeight: "900", color: COLORS.primary }}>
              {week}
            </Text>
          </View>

          {/* RECENT */}
          {recent.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: "700" }}>Recent</Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                {recent.slice(0, 4).map((r, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: "#fff",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      margin: 4
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>{r.problem}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* SYMPTOMS */}
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
                      backgroundColor: "#fff",
                      padding: 16,
                      margin: "1.5%",
                      borderRadius: 16,
                      elevation: 3
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{s.icon}</Text>
                    <Text style={{ marginTop: 8, fontWeight: "600" }}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

        </ScrollView>

        {/* ================= BACKDROP ================= */}
        {result && (
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.35)",
              opacity: backdropOpacity
            }}
          >
            <Pressable style={{ flex: 1 }} onPress={closeSheet} />
          </Animated.View>
        )}

        {/* ================= FLOATING SHEET ================= */}

        {result && (
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              transform: [{ translateY }]
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                overflow: "hidden"
              }}
            >
              {/* HANDLE */}
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  paddingVertical: 10
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 10,
                    backgroundColor: "#ccc",
                    borderRadius: 10
                  }}
                />
              </View>

              {/* SCROLL AREA (FIXED) */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  padding: 16,
                  paddingBottom: 140, // 🔥 IMPORTANT FIX (prevents cut-off)
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <ResultCard result={result} />
              </ScrollView>
            </View>
          </Animated.View>
        )}

      </View>
    </AppContainer>
  );
}