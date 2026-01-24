import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import CustomButton from "../../components/CustomButton";

export default function CreateNewPassword() {
  const router = useRouter();
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
        color="black"
        style={styles.backIcon}
        onPress={() => router.back()}
      />

      {/* Heading */}
      <Text style={styles.title}>Create new password</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 16,
    paddingRight: 10,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
});
