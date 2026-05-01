import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";

import {
  registerUser,
  loginUser,
  resetPassword
} from "../services/authService";

import AppContainer from "../components/AppContainer";

/* ---------------- COLORS ---------------- */
const COLORS = {
  bg: "#F3F5FF",
  primary: "#5B6CFF",
  secondary: "#8F9BFF",
  card: "#FFFFFF",
  text: "#1A1A2E",
  sub: "#7A7A90",
  border: "#E4E7FF"
};

export default function AuthScreen({ navigation }) {
  const [mode, setMode] = useState("register");
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");

  const [pregnancyWeek, setPregnancyWeek] = useState("");
  const [startDate, setStartDate] = useState("");

  /* ---------------- VALIDATION ---------------- */
  const validateStep1 = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Fields");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!fullName || !age || !country) {
      Alert.alert("Fill all fields");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!startDate && !pregnancyWeek) {
      Alert.alert("Enter start date OR week");
      return false;
    }
    return true;
  };

  /* ---------------- ACTIONS ---------------- */
  const handleRegister = async () => {
    if (!validateStep3()) return;

    try {
      await registerUser(email, password, {
        fullName,
        age: Number(age),
        country,
        pregnancyStartDate: startDate || null,
        pregnancyWeek: pregnancyWeek ? Number(pregnancyWeek) : null,
        isManualWeekMode: !startDate
      });

      // 🚨 IMPORTANT CHANGE
      // navigation.replace("Verify"); // 👈 GO TO VERIFY SCREEN
        
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      // navigation.replace("Home");
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }]
      });
    } catch (e) {
      Alert.alert("Login Failed", e.message);
    }
  };

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Enter email first");
      return;
    }

    await resetPassword(email);
    Alert.alert("Reset email sent");
  };

  /* ---------------- STEP UI ---------------- */
  const Step = ({ number, active }) => (
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: active ? COLORS.primary : "#ddd",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>{number}</Text>
    </View>
  );

  return (
    <AppContainer>
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>

        {/* HEADER */}
        <View style={{ padding: 25 }}>
          <Text style={{ fontSize: 36, fontWeight: "800", color: COLORS.text }}>
            🤱 Nurtura
          </Text>
          <Text style={{ color: COLORS.sub }}>
            Smart pregnancy companion
          </Text>
        </View>

        {/* CARD */}
        <View
          style={{
            backgroundColor: COLORS.card,
            margin: 20,
            borderRadius: 28,
            padding: 24,
            elevation: 5
          }}
        >

          {/* MODE SWITCH */}
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            {["login", "register"].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => {
                  setMode(m);
                  setStep(1);
                }}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 16,
                  backgroundColor: mode === m ? COLORS.primary : "#F0F2FF",
                  marginHorizontal: 4
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: mode === m ? "#fff" : COLORS.sub,
                    fontWeight: "700"
                  }}
                >
                  {m === "login" ? "Login" : "Register"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* STEP INDICATOR */}
          {mode === "register" && (
            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
              <Step number={1} active={step >= 1} />
              <Step number={2} active={step >= 2} />
              <Step number={3} active={step >= 3} />
            </View>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <>
              <Input placeholder="Email" value={email} set={setEmail} />
              <Input placeholder="Password" value={password} set={setPassword} secure />

              <TouchableOpacity onPress={handleReset}>
                <Text style={{ color: COLORS.primary, marginTop: 10 }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Button title="Login" onPress={handleLogin} />
            </>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <>
              {step === 1 && (
                <>
                  <Input placeholder="Email" value={email} set={setEmail} />
                  <Input placeholder="Password" value={password} set={setPassword} secure />
                  <Input placeholder="Confirm Password" value={confirmPassword} set={setConfirmPassword} secure />

                  <Button title="Continue →" onPress={() => validateStep1() && setStep(2)} />
                </>
              )}

              {step === 2 && (
                <>
                  <Input placeholder="Full Name" value={fullName} set={setFullName} />
                  <Input placeholder="Age" value={age} set={setAge} keyboard="numeric" />
                  <Input placeholder="Country" value={country} set={setCountry} />

                  <Button title="Continue →" onPress={() => validateStep2() && setStep(3)} />
                </>
              )}

              {step === 3 && (
                <>
                  <Input placeholder="Start Date (YYYY-MM-DD)" value={startDate} set={setStartDate} />
                  <Text style={{ textAlign: "center", marginVertical: 10 }}>OR</Text>
                  <Input placeholder="Pregnancy Week" value={pregnancyWeek} set={setPregnancyWeek} keyboard="numeric" />

                  <Button title="Create Account 🚀" onPress={handleRegister} />
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </AppContainer>
  );
}

/* ---------------- INPUT ---------------- */
const Input = ({ placeholder, value, set, secure, keyboard }) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    secureTextEntry={secure}
    keyboardType={keyboard}
    onChangeText={set}
    placeholderTextColor="#999"
    style={{
      backgroundColor: "#F6F7FF",
      padding: 15,
      borderRadius: 14,
      marginTop: 12,
      borderWidth: 1,
      borderColor: "#E4E7FF"
    }}
  />
);

/* ---------------- BUTTON ---------------- */
const Button = ({ title, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      marginTop: 18,
      backgroundColor: "#5B6CFF",
      padding: 16,
      borderRadius: 18
    }}
  >
    <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
      {title}
    </Text>
  </TouchableOpacity>
);