import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
