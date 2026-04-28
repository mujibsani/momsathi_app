import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./src/screens/HomeScreen";
import SymptomScreen from "./src/screens/SymptomScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import WeeklyReportScreen from "./src/screens/WeeklyReportScreen";
import DashboardScreen from "./src/screens/DashboardScreen";

import { scheduleDailyReminder } from "./src/engine/notificationEngine";

/* ---------------- GLOBAL NOTIFICATION HANDLER ---------------- */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------------- BOTTOM TABS ---------------- */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          let iconName = "help-circle-outline";

          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Symptoms") iconName = "heart-outline";
          else if (route.name === "History") iconName = "time-outline";
          else if (route.name === "Dashboard") iconName = "stats-chart-outline";

          return (
            <Ionicons name={iconName} size={size || 24} color={color} />
          );
        },

        tabBarActiveTintColor: "#2D3A8C",
        tabBarInactiveTintColor: "gray",
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
  useEffect(() => {
    initNotifications();
  }, []);

  const initNotifications = async () => {
    try {
      // 🔥 SDK 55 SAFE DELAY (important)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("❌ Notification permission denied");
        return;
      }

      // 🔥 extra safety delay before scheduling
      setTimeout(async () => {
        await scheduleDailyReminder();
      }, 1500);

    } catch (error) {
      console.log("❌ Notification init error:", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* MAIN APP */}
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          {/* WEEKLY REPORT */}
          <Stack.Screen
            name="WeeklyReport"
            component={WeeklyReportScreen}
            options={{ title: "Weekly Report" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}