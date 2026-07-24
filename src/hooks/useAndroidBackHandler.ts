// src/hooks/useAndroidBackHandler.ts
// Handles Android physical hardware back button presses across screens.

import { useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import { useRouter } from "expo-router";

export function useAndroidBackHandler(onBack?: () => boolean | void, fallbackRoute: string = "/") {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const handleBackPress = () => {
      if (onBack) {
        const handled = onBack();
        if (handled) return true;
      }
      if (router.canGoBack()) {
        router.back();
        return true;
      } else {
        router.replace(fallbackRoute as any);
        return true;
      }
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => subscription.remove();
  }, [onBack, fallbackRoute, router]);
}
