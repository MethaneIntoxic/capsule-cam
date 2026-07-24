// app/_layout.tsx
// Root layout — wraps the app with gesture handler, safe area, contexts, and navigation.

import { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Platform } from "react-native";
import { CollectionProvider } from "../src/state/CollectionContext";

// Lazy-require SplashScreen — no-op on web
let SplashScreenModule: { preventAutoHideAsync: () => Promise<void>; hideAsync: () => Promise<void> } | null = null;
try {
  SplashScreenModule = require("expo-splash-screen");
} catch {
  // Native module not available (web)
}
if (SplashScreenModule) {
  SplashScreenModule.preventAutoHideAsync();
} else {
  // Native module not available (web)
}

export default function RootLayout() {
  const hidden = useRef(false);

  useEffect(() => {
    if (hidden.current) return;
    hidden.current = true;
    const timer = setTimeout(() => {
      SplashScreenModule?.hideAsync();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <CollectionProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: Platform.OS === "web" ? "none" : "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="capture" />
            <Stack.Screen name="studio" />
            <Stack.Screen name="machine" />
            <Stack.Screen name="reveal" />
            <Stack.Screen name="collection" />
          </Stack>
        </CollectionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
