// src/hooks/useHaptics.ts
// Thin wrapper around expo-haptics for consistent feedback patterns.

import { useCallback } from "react";
import * as Haptics from "expo-haptics";

export function useHaptics() {
  const tick = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }, []);

  const activate = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  }, []);

  const impact = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
  }, []);

  const reveal = useCallback(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }, []);

  return { tick, activate, impact, reveal };
}
