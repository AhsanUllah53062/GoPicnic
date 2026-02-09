import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CustomButton from "../../components/common/CustomButton";

export default function OtpVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]); // ✅ Correct typing

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 4) {
      Alert.alert("Error", "Please enter the full 4-digit code.");
      return;
    }
    console.log("Entered OTP:", code);
    // TODO: Replace with real verification logic
    router.push("/create-new-password");
  };

  const handleResend = () => {
    // TODO: Implement resend logic
    Alert.alert("Success", "A new verification code has been sent.");
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

      {/* Title */}
      <Text style={styles.title}>OTP Verification</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Enter the verification code we just sent to your email address.
      </Text>

      {/* OTP Input Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              inputs.current[index] = el; // ✅ No return value, just assignment
            }}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && !digit && index > 0) {
                inputs.current[index - 1]?.focus();
              }
            }}
          />
        ))}
      </View>

      {/* Verify Button */}
      <View style={styles.buttonWrapper}>
        <CustomButton title="Verify" filled onPress={handleVerify} />
      </View>

      {/* Resend Code */}
      <View style={styles.footer}>
        <Text style={{ fontSize: 16, color: "#000" }}>
          Didn’t receive code?{" "}
        </Text>
        <Pressable onPress={handleResend}>
          <Text style={styles.resendText}>Resend</Text>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: 60,
    height: 60,
    textAlign: "center",
    fontSize: 22,
    color: "#000",
  },
  buttonWrapper: {
    alignItems: "center",
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  resendText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "500",
  },
});
