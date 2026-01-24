import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CustomButton, PageIndicator } from "../../components";

export default function Welcome() {
  const router = useRouter();

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 60,
    backgroundColor: "#fff",
  },
  guestContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  pinkLine: {
    width: 20,
    height: 2,
    backgroundColor: "#FF2D95",
    marginBottom: 8,
  },
  guestText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
