// src/animations/capsuleAnimations.ts
// Reanimated configs for capsule opening and photo reveal.

import {
  withTiming,
  withSpring,
  Easing,
  type AnimationCallback,
} from "react-native-reanimated";
import { DURATIONS } from "./machineAnimations";

// Top half slides up
export function withOpen(cb?: AnimationCallback) {
  return withTiming(-80, {
    duration: DURATIONS.OPEN,
    easing: Easing.out(Easing.back(1.5)),
  }, cb);
}

// Photo card scales and fades in
export function withReveal(cb?: AnimationCallback) {
  return withTiming(1, {
    duration: DURATIONS.REVEAL,
    easing: Easing.out(Easing.back(1.2)),
  }, cb);
}

// Spring for card landing
export function withCardAppear() {
  return withSpring(1, {
    stiffness: 150,
    damping: 12,
    mass: 0.5,
  });
}
