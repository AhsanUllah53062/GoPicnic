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
import { Alert, Text, TextInput, View } from "react-native";
import CustomButton from "../../components/common/CustomButton";

export default function CreateNewPassword() {
  const router = useRouter();
  const { colors } = useThemedStyles();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // TODO: Replace with real reset logic (API call)
    console.log("Password reset to:", newPassword);
    Alert.alert("Success", "Your password has been reset.", [
      { text: "OK", onPress: () => router.push("/login") },
    ]);
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
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Create new password
      </Text>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        Your new password must be unique from those previously used.
      </Text>

      {/* New Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginTop: 0 }]}
          placeholder="New Password"
          placeholderTextColor="#666"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <MaterialIcons
          name={showNewPassword ? "visibility-off" : "visibility"}
          size={24}
          color="gray"
          style={styles.eyeIcon}
          onPress={() => setShowNewPassword(!showNewPassword)}
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginTop: 0 }]}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <MaterialIcons
          name={showConfirmPassword ? "visibility-off" : "visibility"}
          size={24}
          color="gray"
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      </View>

      {/* Reset Password Button */}
      <View style={styles.buttonWrapper}>
        <CustomButton
          title="Reset Password"
          filled
          onPress={handleResetPassword}
        />
      </View>
    </View>
  );
}

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
  buttonWrapper: {
    marginTop: Spacing.xl,
    alignItems: "center" as const,
  },
};
