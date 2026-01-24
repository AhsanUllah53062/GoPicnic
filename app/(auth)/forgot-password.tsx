import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CustomButton from "../../components/common/Button"; // ✅ use consistent path
import { resetPassword } from "../../services/auth"; // ✅ import Firebase service

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert(
        "Success",
        "If this email is registered, a reset link has been sent.",
        [
          {
            text: "OK",
            onPress: () => router.push("/login"), // ✅ navigate back to login
          },
        ],
      );
    } catch (error: any) {
      Alert.alert("Reset failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <MaterialIcons
        name="arrow-back"
        size={24}
        color="black"
        style={styles.backIcon}
        onPress={() => router.back()}
      />

      {/* Heading */}
      <Text style={styles.title}>Forgot Password?</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Don’t worry! Please enter the email address linked with your account.
      </Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Send Code Button */}
      <View style={styles.buttonWrapper}>
        <CustomButton title="Send Reset Link" filled onPress={handleSendCode} />
      </View>

      {/* Footer: Remember password? Login */}
      <View style={styles.footer}>
        <Text style={{ fontSize: 16, color: "#000" }}>Remember password? </Text>
        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  backIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "500",
  },
});
