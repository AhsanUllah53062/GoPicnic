import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// ✅ Import your providers
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../src/context/CartContext";
import { ThemeProvider as AppThemeProvider } from "../src/context/ThemeContext";
import { TripProvider } from "../src/context/TripContext";
import { UserProvider, useUser } from "../src/context/UserContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <AuthProvider>
            <TripProvider>
              <CartProvider>
                <UserProvider>
                  <StatusBar
                    style={colorScheme === "dark" ? "light" : "dark"}
                  />
                  <ThemeProvider
                    value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                  >
                    <ConditionalStack />
                  </ThemeProvider>
                </UserProvider>
              </CartProvider>
            </TripProvider>
          </AuthProvider>
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ✅ Component that handles conditional routing
function ConditionalStack() {
  const { user, loading, isAuthVerified } = useUser();

  // Debug log
  console.log("🔍 ConditionalStack render:", {
    loading,
    isAuthVerified,
    userExists: !!user,
    userEmail: user?.email,
  });

  // Show loading only while Firebase is verifying (and nothing is determined yet)
  if (loading) {
    console.log("📍 Showing loading spinner");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  // After verification is complete, route based on whether user is authenticated
  const shouldShowHome = isAuthVerified && user;
  const initialRouteName = shouldShowHome ? "(tabs)" : "(auth)/welcome";

  console.log(
    "📍 Auth verified:",
    isAuthVerified,
    "User exists:",
    !!user,
    "Show home:",
    shouldShowHome,
    "Initial route:",
    initialRouteName,
  );

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      {/* Auth Screens - Always available */}
      <Stack.Screen name="(auth)/welcome" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(auth)/forgot-password" />
      <Stack.Screen name="(auth)/otp-verification" />
      <Stack.Screen name="(auth)/create-new-password" />

      {/* Home Tabs - Always available */}
      <Stack.Screen
        name="(tabs)"
        options={{
          animationEnabled: false,
        }}
      />

      {/* User Screens - Always available but only accessible when authenticated */}
      <Stack.Screen name="trip/[id]" />
      <Stack.Screen name="place/[id]" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="notification/[id]" />
      <Stack.Screen name="profile/details" />
      <Stack.Screen name="profile/security" />
      <Stack.Screen name="profile/preferences" />
      <Stack.Screen name="profile/favorites" />
      <Stack.Screen name="profile/friends" />
      <Stack.Screen name="profile/gear" />
      <Stack.Screen name="profile/help" />
      <Stack.Screen name="profile/emergency" />
      <Stack.Screen name="profile/documents" />
      <Stack.Screen name="profile/personal-info" />
      <Stack.Screen name="shop/cart" />
      <Stack.Screen name="shop/checkout" />
      <Stack.Screen name="shop/payment" />
      <Stack.Screen name="shop/order-confirmation" />
      <Stack.Screen name="shop/orders" />
      <Stack.Screen name="shop/product-detail" />
    </Stack>
  );
}
