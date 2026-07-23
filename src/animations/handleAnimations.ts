// src/animations/handleAnimations.ts
// Reanimated configs for handle snap-back and idle sway.

import { withSpring, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { DURATIONS } from "./machineAnimations";

export function withSnapBack() {
  return withSpring(0, {
    stiffness: 200,
    damping: 20,
    mass: 0.5,
  });
}

export function withIdleSway(amplitude: number = 3) {
  return withRepeat(
    withSequence(
      withTiming(-amplitude, {
        duration: 1500,
        easing: Easing.inOut(Easing.sin),
      }),
      withTiming(amplitude, {
        duration: 1500,
        easing: Easing.inOut(Easing.sin),
      })
    ),
    -1,
    true
  );
}
