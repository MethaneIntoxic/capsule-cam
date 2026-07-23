// src/hooks/useHaptics.ts
// Comprehensive haptics engine supporting expo-haptics & HTML5 navigator.vibrate fallback.

import { useCallback } from "react";

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
    try {
      if (HapticsModule) {
        HapticsModule.selectionAsync();
      } else {
        webVibrate(15);
      }
    } catch {}
  }, []);

  const tick = useCallback(() => {
    try {
      if (HapticsModule) {
        HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle.Light);
      } else {
        webVibrate(20);
      }
    } catch {}
  }, []);

  const activate = useCallback(() => {
    try {
      if (HapticsModule) {
        HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle.Medium);
      } else {
        webVibrate(40);
      }
    } catch {}
  }, []);

  const heavyLock = useCallback(() => {
    try {
      if (HapticsModule) {
        HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle.Heavy);
        setTimeout(() => {
          HapticsModule?.notificationAsync(HapticsModule.NotificationFeedbackType.Success);
        }, 120);
      } else {
        webVibrate([40, 30, 60]);
      }
    } catch {}
  }, []);

  const impact = useCallback(() => {
    try {
      if (HapticsModule) {
        HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle.Heavy);
      } else {
        webVibrate(60);
      }
    } catch {}
  }, []);

  const reveal = useCallback(() => {
    try {
      if (HapticsModule) {
        HapticsModule.notificationAsync(HapticsModule.NotificationFeedbackType.Success);
      } else {
        webVibrate([50, 40, 80, 40, 100]);
      }
    } catch {}
  }, []);

  const startRumble = useCallback(() => {
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
      } else {
        webVibrate([50, 30, 50, 30, 50, 30, 70]);
      }
    } catch {}
  }, []);

  return { selection, tick, activate, heavyLock, impact, reveal, startRumble };
}

