// src/hooks/useHaptics.ts
// Thin wrapper around expo-haptics for consistent feedback patterns.
// No-ops on web where expo-haptics is unavailable.

import { useCallback } from "react";

let HapticsModule: typeof import("expo-haptics") | null = null;
try {
  HapticsModule = require("expo-haptics");
} catch {
  // Native module not available (web)
}

export function useHaptics() {
  const tick = useCallback(() => {
    try {
      HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Light);
    } catch {}
  }, []);

  const activate = useCallback(() => {
    try {
      HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Medium);
    } catch {}
  }, []);

  const impact = useCallback(() => {
    try {
      HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Heavy);
    } catch {}
  }, []);

  const reveal = useCallback(() => {
    try {
      HapticsModule?.notificationAsync(HapticsModule.NotificationFeedbackType.Success);
    } catch {}
  }, []);

  return { tick, activate, impact, reveal };
}
