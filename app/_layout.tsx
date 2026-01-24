import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ✅ Import your providers
import { CartProvider } from '../src/context/CartContext';
import { TripProvider } from '../src/context/TripContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Wrap everything in TripProvider + CartProvider */}
        <TripProvider>
          <CartProvider>
            {/* Global status bar for all screens */}
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                {/* Entry point (redirects to /welcome via index.tsx) */}
                <Stack.Screen name="welcome" />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                {/* ✅ Use the (tabs) group instead of home */}
                <Stack.Screen name="(tabs)" />
              </Stack>
            </ThemeProvider>
          </CartProvider>
        </TripProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
