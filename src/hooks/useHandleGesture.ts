// src/hooks/useHandleGesture.ts
// Pan gesture + tap helper for the Gashapon machine handle knob.

import { useRef } from "react";
import { Gesture, type ComposedGesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
  withSpring,
  Easing,
  type SharedValue,
  type AnimatedStyle,
} from "react-native-reanimated";
import type { ViewStyle } from "react-native";
import { panToDegrees, clampDegrees } from "../utils/angles";

const ROTATION_THRESHOLD = 220;
const HAPTIC_INTERVAL = 45;

export interface UseHandleGestureConfig {
  onActivate: () => void;
  onRotationChange: (degrees: number) => void;
  onHapticTick: (tick: number) => void;
  enabled: boolean;
}

export interface HandleGestureResult {
  gesture: ComposedGesture;
  handleStyle: AnimatedStyle<ViewStyle>;
  rotation: SharedValue<number>;
  triggerFullTurn: () => void;
}

export function useHandleGesture(config: UseHandleGestureConfig): HandleGestureResult {
  const rotation = useSharedValue(0);
  const lastHapticTick = useSharedValue(0);
  const isActivating = useRef(false);

  const triggerFullTurn = () => {
    if (isActivating.current || !config.enabled) return;
    isActivating.current = true;

    // Tick callbacks during programmatic turn
    let currentTick = 0;
    const interval = setInterval(() => {
      currentTick += 1;
      config.onHapticTick(currentTick);
      if (currentTick >= 6) {
        clearInterval(interval);
      }
    }, 100);

    rotation.value = withTiming(
      360,
      { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
      (finished) => {
        if (finished) {
          runOnJS(config.onActivate)();
          rotation.value = 0;
          lastHapticTick.value = 0;
          isActivating.current = false;
        }
      }
    );
  };

  const tapGesture = Gesture.Tap()
    .enabled(config.enabled)
    .onEnd(() => {
      if (isActivating.current) return;
      runOnJS(triggerFullTurn)();
    });

  const panGesture = Gesture.Pan()
    .enabled(config.enabled)
    .minDistance(2)
    .onUpdate((event) => {
      if (isActivating.current) return;

      const newRotation = clampDegrees(
        panToDegrees(event.translationX, event.translationY, 2.5)
      );

      if (newRotation > rotation.value) {
        rotation.value = newRotation;

        const tickFloor = Math.floor(newRotation / HAPTIC_INTERVAL);
        if (tickFloor > lastHapticTick.value) {
          lastHapticTick.value = tickFloor;
          runOnJS(config.onHapticTick)(tickFloor);
        }

        runOnJS(config.onRotationChange)(newRotation);
      }
    })
    .onEnd(() => {
      if (isActivating.current) return;

      if (rotation.value >= ROTATION_THRESHOLD) {
        isActivating.current = true;
        // Finish turning 360
        rotation.value = withTiming(
          360,
          { duration: 300 },
          (finished) => {
            if (finished) {
              runOnJS(config.onActivate)();
              rotation.value = 0;
              lastHapticTick.value = 0;
              isActivating.current = false;
            }
          }
        );
      } else {
        // Snap back if didn't reach threshold
        rotation.value = withSpring(0, {
          stiffness: 200,
          damping: 20,
          mass: 0.5,
        });
        lastHapticTick.value = 0;
      }
    });

  const gesture = Gesture.Simultaneous(tapGesture, panGesture);

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return { gesture, handleStyle, rotation, triggerFullTurn };
}

