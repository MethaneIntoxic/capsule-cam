// src/hooks/useHandleGesture.ts
// Pan gesture → rotation degrees conversion for the machine handle.

import { Gesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  type SharedValue,
  type AnimatedStyle,
} from "react-native-reanimated";
import type { ViewStyle } from "react-native";
import { panToDegrees, clampDegrees } from "../utils/angles";

const ROTATION_THRESHOLD = 300;
const HAPTIC_INTERVAL = 45;

export interface UseHandleGestureConfig {
  onActivate: () => void;
  onRotationChange: (degrees: number) => void;
  onHapticTick: (tick: number) => void;
  enabled: boolean;
}

export interface HandleGestureResult {
  gesture: ReturnType<typeof Gesture.Pan>;
  handleStyle: AnimatedStyle<ViewStyle>;
  rotation: SharedValue<number>;
}

export function useHandleGesture(config: UseHandleGestureConfig): HandleGestureResult {
  const rotation = useSharedValue(0);
  const lastHapticTick = useSharedValue(0);

  const gesture = Gesture.Pan()
    .enabled(config.enabled)
    .minDistance(3)
    .onUpdate((event) => {
      const newRotation = clampDegrees(
        panToDegrees(event.translationX, event.translationY, 2.5)
      );

      // Only count forward progress
      if (newRotation > rotation.value) {
        rotation.value = newRotation;

        // Haptic ticks every HAPTIC_INTERVAL degrees
        const tickFloor = Math.floor(newRotation / HAPTIC_INTERVAL);
        if (tickFloor > lastHapticTick.value) {
          lastHapticTick.value = tickFloor;
          runOnJS(config.onHapticTick)(tickFloor);
        }

        runOnJS(config.onRotationChange)(newRotation);
      }
    })
    .onEnd(() => {
      if (rotation.value >= ROTATION_THRESHOLD) {
        runOnJS(config.onActivate)();
      }
      // Snap back
      rotation.value = withSpring(0, {
        stiffness: 200,
        damping: 20,
        mass: 0.5,
      });
      lastHapticTick.value = 0;
    });

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return { gesture, handleStyle, rotation };
}
