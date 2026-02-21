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
import CustomButton from "../../components/common/Button";
import { resetPassword } from "../../services/auth";

export default function ForgotPassword() {
  const router = useRouter();
  const { colors } = useThemedStyles();
  const [email, setEmail] = useState<string>("");

  const styles = {
    container: {
      flex: 1,
      ...GlobalStyles.screenContainer,
      paddingHorizontal: Spacing.gutter,
      paddingTop: Spacing.xxl,
    },
    backIcon: {
      marginBottom: Spacing.lg,
    },
    title: {
      ...TypographyStyles.h2,
      marginBottom: Spacing.md,
    },
    subtitle: {
      ...TypographyStyles.body,
      marginBottom: Spacing.xl,
      lineHeight: 22,
    },
    input: {
      ...InputStyles.baseInput,
      fontSize: 16,
    },
    buttonWrapper: {
      marginTop: Spacing.xl,
      alignItems: "center" as const,
    },
    footer: {
      marginTop: Spacing.xxl,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
    },
    loginText: {
      ...TypographyStyles.label,
      color: colors.primary,
      fontWeight: "600" as const,
    },
  };

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
        color={colors.text.primary}
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
        style={[styles.input, { color: colors.text.primary }]}
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
        <Text style={{ fontSize: 16, color: colors.text.primary }}>
          Remember password?{" "}
        </Text>
        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
