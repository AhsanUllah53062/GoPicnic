import { Colors, Spacing } from "@/constants/styles";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
