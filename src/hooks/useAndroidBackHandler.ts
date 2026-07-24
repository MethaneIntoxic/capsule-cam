// src/hooks/useAndroidBackHandler.ts
// Handles Android physical hardware back button presses deterministically.

import { useEffect } from "react";
import { BackHandler, Platform } from "react-native";

export function useAndroidBackHandler(onBack: () => boolean | void) {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const handleBackPress = () => {
      const handled = onBack();
      return handled ?? true;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => subscription.remove();
  }, [onBack]);
}
