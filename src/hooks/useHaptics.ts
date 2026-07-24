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

let lastVibrateTime = 0;

function webVibrate(pattern: number | number[]) {
  const now = Date.now();
  if (now - lastVibrateTime < 15 && typeof pattern === "number") return;
  lastVibrateTime = now;
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
    webVibrate([25, 15, 25]);
    audioEngine.playCrankClick();
    try {
      HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Medium);
    } catch {}
  }, []);

  const crankRumble = useCallback(() => {
    webVibrate([30, 20, 40, 20, 50, 30, 60, 30, 80, 40, 100]);
    audioEngine.playCrankClick();
    try {
      HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Heavy);
    } catch {}
  }, []);

  const activate = useCallback(() => {
    webVibrate([45, 20, 60]);
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
    webVibrate([70, 30, 90]);
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
    webVibrate([50, 30, 50, 30, 60, 40, 80, 40, 100, 50, 120, 50, 150]);
    audioEngine.playShakingRumble();
    try {
      if (HapticsModule) {
        let count = 0;
        const interval = setInterval(() => {
          count++;
          try {
            HapticsModule?.impactAsync(HapticsModule.ImpactFeedbackStyle.Heavy);
          } catch {}
          if (count >= 8) clearInterval(interval);
        }, 60);
      }
    } catch {}
  }, []);

  return { selection, tick, crankRumble, activate, heavyLock, impact, reveal, startRumble };
}

