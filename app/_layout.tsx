import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// ✅ Import your providers
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../src/context/CartContext";
import { TripProvider } from "../src/context/TripContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <TripProvider>
            <CartProvider>
              {/* Global status bar */}
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack screenOptions={{ headerShown: false }}>
                  {/* ✅ Auth flow screens */}
                  <Stack.Screen name="(auth)/welcome" />
                  <Stack.Screen name="(auth)/login" />
                  <Stack.Screen name="(auth)/signup" />
                  <Stack.Screen name="(auth)/forgot-password" />

                  {/* ✅ Main app tabs */}
                  <Stack.Screen name="(tabs)" />
                </Stack>
              </ThemeProvider>
            </CartProvider>
          </TripProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
