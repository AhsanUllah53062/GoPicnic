import { GlobalStyles, TypographyStyles } from "@/constants/componentStyles";
import { Spacing } from "@/constants/styles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { CustomButton, PageIndicator } from "../../components";

export default function Welcome() {
  const router = useRouter();
  const { colors } = useThemedStyles();

  const styles = {
    container: {
      flex: 1,
      justifyContent: "flex-end" as const,
      alignItems: "center" as const,
      paddingBottom: Spacing.xl,
      ...GlobalStyles.screenContainer,
    },
    guestContainer: {
      alignItems: "center" as const,
      marginTop: Spacing.lg,
    },
    pinkLine: {
      width: 20,
      height: 2,
      backgroundColor: colors.accent,
      marginBottom: Spacing.sm,
    },
    guestText: {
      color: colors.primary,
      ...TypographyStyles.label,
    },
  };

  return (
    <View style={styles.container}>
      <PageIndicator />

      <CustomButton
        title="Login"
        onPress={() => router.push("/login")}
        filled
      />
      <CustomButton title="Register" onPress={() => router.push("/signup")} />

      <View style={styles.guestContainer}>
        <View style={styles.pinkLine} />
        {/* ✅ Navigate to tab root instead of /home */}
        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.guestText}>Continue as a guest</Text>
        </Pressable>
      </View>
    </View>
  );
}
