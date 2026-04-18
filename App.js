import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import SymptomScreen from "./src/screens/SymptomScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MomSathi" component={HomeScreen} />
        <Stack.Screen name="Check Health" component={SymptomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}