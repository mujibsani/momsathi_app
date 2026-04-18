import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import SymptomScreen from "./src/screens/SymptomScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* BOTTOM TABS */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          let iconName = "help-circle-outline"; // fallback icon

          if (route.name === "Home") {
            iconName = "home-outline";
          }

          if (route.name === "Symptoms") {
            iconName = "heart-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size || 24}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: "#2D3A8C",
        tabBarInactiveTintColor: "gray"
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Symptoms" component={SymptomScreen} />
    </Tab.Navigator>
  );
}

/* ROOT APP */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}