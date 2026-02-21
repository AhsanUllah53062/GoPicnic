import {
    GlobalStyles,
    InputStyles,
    TypographyStyles,
} from "@/constants/componentStyles";
import { Spacing } from "@/constants/styles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const { colors } = useThemedStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const styles = {
    container: {
      ...GlobalStyles.screenContainer,
      paddingHorizontal: Spacing.gutter,
      paddingTop: Spacing.xxl,
    },
    backButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: Spacing.lg,
    },
    backText: {
      ...TypographyStyles.label,
      color: colors.text.primary,
      marginLeft: Spacing.xs,
    },
    title: {
      ...TypographyStyles.h2,
      color: colors.text.primary,
      marginBottom: Spacing.sm,
    },
    subtitle: {
      ...TypographyStyles.body,
      color: colors.text.secondary,
      marginBottom: Spacing.xl,
    },
    input: {
      ...InputStyles.baseInput,
      marginTop: Spacing.md,
      color: colors.text.primary,
    },
    passwordContainer: {
      ...InputStyles.baseInput,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginTop: Spacing.md,
      paddingRight: Spacing.md,
    },
    eyeIcon: {
      marginLeft: Spacing.md,
    },
    forgotPassword: {
      alignSelf: "flex-end" as const,
      color: colors.primary,
      ...TypographyStyles.label,
      marginTop: Spacing.md,
    },
    buttonWrapper: {
      marginTop: Spacing.xl,
      alignItems: "center" as const,
    },
    signupContainer: {
      marginTop: Spacing.xxl,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
    },
    signupText: {
      ...TypographyStyles.label,
      color: colors.text.primary,
    },
    signupLink: {
      ...TypographyStyles.label,
      color: colors.primary,
      fontWeight: "600" as const,
    },
  };

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
        <MaterialIcons
          name="arrow-back-ios"
          size={20}
          color={colors.text.primary}
        />
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
