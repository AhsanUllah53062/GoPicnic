import { GlobalStyles, TypographyStyles } from "@/constants/componentStyles";
import { Spacing } from "@/constants/styles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import CustomButton from "../../components/common/CustomButton";

export default function OtpVerification() {
  const router = useRouter();
  const { colors, styles: themedStyles } = useThemedStyles();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]); // ✅ Correct typing

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
    otpContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      marginBottom: Spacing.xl,
    },
    otpInput: {
      borderWidth: 1,
      borderRadius: 8,
      width: 60,
      height: 60,
      textAlign: "center" as const,
      fontSize: 22,
    },
    buttonWrapper: {
      alignItems: "center" as const,
    },
    footer: {
      marginTop: Spacing.xxl,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
    },
    resendText: {
      ...TypographyStyles.label,
      color: colors.primary,
      fontWeight: "600" as const,
    },
  };

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
        color={colors.text.primary}
        style={styles.backIcon}
        onPress={() => router.back()}
      />

      {/* Title */}
      <Text style={[styles.title, { color: colors.text.primary }]}>
        OTP Verification
      </Text>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
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
            style={[
              styles.otpInput,
              { borderColor: colors.border.light, color: colors.text.primary },
            ]}
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
