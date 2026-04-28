import { useColorScheme } from "react-native";

export const getTheme = () => {
  const scheme = useColorScheme();

  return {
    isDark: scheme === "dark",

    bg: scheme === "dark" ? "#0F172A" : "#F6F8FF",
    card: scheme === "dark" ? "#1E293B" : "#FFFFFF",

    text: scheme === "dark" ? "#FFFFFF" : "#222222",
    subtext: scheme === "dark" ? "#A1A1AA" : "#666666",

    primary: "#2D3A8C",
    success: "#4CAF50",
    danger: "#E53935",
  };
};