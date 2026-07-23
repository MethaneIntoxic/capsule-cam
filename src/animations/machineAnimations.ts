// src/animations/machineAnimations.ts
// Reanimated animation configs for the gashapon machine states.

import {
  withTiming,
  withSequence,
  withSpring,
  Easing,
  type AnimatableValue,
  type AnimationCallback,
} from "react-native-reanimated";

export const DURATIONS = {
  SHAKE: 600,
  SHAKE_CYCLE: 100,
  DISPENSE_INTERNAL: 400,
  DROP: 800,
  TRAY_BOUNCE: 250,
  OPEN: 600,
  REVEAL: 400,
  PARTICLE_BURST: 600,
  HANDLE_SNAP_BACK: 300,
};

// Machine body shake: oscillate X position
export function withShake(offset: number = 6, cb?: AnimationCallback) {
  return withSequence(
    withTiming(-offset, { duration: DURATIONS.SHAKE_CYCLE, easing: Easing.inOut(Easing.quad) }),
    withTiming(offset, { duration: DURATIONS.SHAKE_CYCLE, easing: Easing.inOut(Easing.quad) }),
    withTiming(-offset / 2, { duration: DURATIONS.SHAKE_CYCLE, easing: Easing.inOut(Easing.quad) }),
    withTiming(offset / 2, { duration: DURATIONS.SHAKE_CYCLE, easing: Easing.inOut(Easing.quad) }),
    withTiming(0, { duration: DURATIONS.SHAKE_CYCLE, easing: Easing.inOut(Easing.quad) }, cb)
  );
}

// Capsule dispense: accelerate downward
export function withDispense(targetY: number, cb?: AnimationCallback) {
  return withTiming(targetY, {
    duration: DURATIONS.DISPENSE_INTERNAL,
    easing: Easing.in(Easing.quad),
  }, cb);
}

// Capsule drop with bounce-like easing
export function withDrop(targetY: number, cb?: AnimationCallback) {
  return withTiming(targetY, {
    duration: DURATIONS.DROP,
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  }, cb);
}

// Spring bounce for tray settle
export function withBounce(cb?: AnimationCallback) {
  return withSpring(0, {
    stiffness: 300,
    damping: 15,
    mass: 0.3,
  }, cb);
}
