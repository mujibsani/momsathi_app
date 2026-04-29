import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/services/firebase";

/* ---------------- SCREENS ---------------- */
import HomeScreen from "./src/screens/HomeScreen";
import SymptomScreen from "./src/screens/SymptomScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import WeeklyReportScreen from "./src/screens/WeeklyReportScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import AuthScreen from "./src/screens/AuthScreen";

/* ---------------- ENGINE ---------------- */
import { scheduleDailyReminder } from "./src/engine/notificationEngine";

/* ---------------- NOTIFICATION HANDLER ---------------- */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------------- TABS ---------------- */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2D3A8C",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let icon = "help-circle-outline";

          if (route.name === "Home") icon = "home-outline";
          else if (route.name === "Symptoms") icon = "heart-outline";
          else if (route.name === "History") icon = "time-outline";
          else if (route.name === "Dashboard") icon = "stats-chart-outline";

          return <Ionicons name={icon} size={size || 24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Symptoms" component={SymptomScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
}

/* ---------------- ROOT APP ---------------- */
export default function App() {
  const [user, setUser] = useState(null);
  const [initDone, setInitDone] = useState(false);

  /* ---------------- AUTH LISTENER ---------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitDone(true);
    });

    return unsubscribe;
  }, []);

  /* ---------------- NOTIFICATIONS ---------------- */
  useEffect(() => {
    initNotifications();
  }, []);

  const initNotifications = async () => {
    try {
      // small delay for SDK stability
      await new Promise((r) => setTimeout(r, 1500));

      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Notification permission denied");
        return;
      }

      setTimeout(async () => {
        await scheduleDailyReminder();
      }, 1000);

    } catch (err) {
      console.log("Notification error:", err);
    }
  };

  /* ---------------- LOADING STATE ---------------- */
  if (!initDone) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* AUTH GATE */}
            {!user ? (
              <Stack.Screen name="Auth" component={AuthScreen} />
            ) : (
              <>
                {/* MAIN APP */}
                <Stack.Screen name="Main" component={MainTabs} />

                {/* WEEKLY REPORT */}
                <Stack.Screen
                  name="WeeklyReport"
                  component={WeeklyReportScreen}
                  options={{ headerShown: true, title: "Weekly Report" }}
                />
              </>
            )}

          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}