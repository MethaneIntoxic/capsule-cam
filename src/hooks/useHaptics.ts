// src/hooks/useHaptics.ts
// Comprehensive haptics engine supporting expo-haptics & HTML5 navigator.vibrate fallback.

import { useCallback } from "react";

import { audioEngine } from "../utils/audioEngine";

let HapticsModule: typeof import("expo-haptics") | null = null;
try {
  HapticsModule = require("expo-haptics");
} catch {
  // Web fallback
}

function webVibrate(pattern: number | number[]) {
  try {
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {}
}

export function useHaptics() {
  const selection = useCallback(() => {
    webVibrate(20);
    try {
      HapticsModule?.selectionAsync();
    } catch {}
  }, []);

  const tick = useCallback(() => {
    webVibrate(25);
    audioEngine.playCrankClick();
    try {
      HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Light);
    } catch {}
  }, []);

  const activate = useCallback(() => {
    webVibrate(45);
    audioEngine.playCoinInsert();
    try {
      HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Medium);
    } catch {}
  }, []);

  const heavyLock = useCallback(() => {
    webVibrate([40, 30, 60, 30, 80]);
    audioEngine.playCoinInsert();
    try {
      HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Heavy);
    } catch {}
  }, []);

  const impact = useCallback(() => {
    webVibrate(70);
    audioEngine.playTrayThud();
    try {
      HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Heavy);
    } catch {}
  }, []);

  const reveal = useCallback(() => {
    webVibrate([60, 40, 80, 40, 120]);
    audioEngine.playUnboxChime();
    try {
      HapticsModule?.notificationAsync(HapticsModule.NotificationFeedbackType.Success);
    } catch {}
  }, []);

  const startRumble = useCallback(() => {
    webVibrate([50, 30, 50, 30, 60, 40, 80, 40, 100]);
    audioEngine.playShakingRumble();
    try {
      if (HapticsModule) {
        let count = 0;
        const interval = setInterval(() => {
          count++;
          try {
            HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Medium);
          } catch {}
          if (count >= 6) clearInterval(interval);
        }, 70);
      }
    } catch {}
  }, []);

  return { selection, tick, activate, heavyLock, impact, reveal, startRumble };
}

