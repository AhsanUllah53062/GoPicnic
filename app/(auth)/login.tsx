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
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Both email and password are required.");
      return;
    }
    try {
      await login(email, password);
      router.replace("/(tabs)"); // ✅ go to Home tabs, not welcome
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#000" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue your journey</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginTop: 0 }]}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <MaterialIcons
          name={showPassword ? "visibility-off" : "visibility"}
          size={22}
          color="#666"
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      {/* Forgot Password Link */}
      <Pressable onPress={() => router.push("/forgot-password")}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </Pressable>

      {/* Login Button */}
      <View style={styles.buttonWrapper}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Button title="Login" filled onPress={handleLogin} />
        )}
      </View>

      {/* Register Now */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
        <Pressable onPress={() => router.push("/signup")}>
          <Text style={styles.signupLink}> Register Now</Text>
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    fontSize: 16,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 16,
    paddingRight: 10,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#007AFF",
    fontSize: 14,
    marginTop: 10,
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
  signupContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 16,
    color: "#000",
  },
  signupLink: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
});
