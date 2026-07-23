// src/animations/transitions.ts
// Shared screen transition configs.

import { Easing } from "react-native-reanimated";

export const SCREEN_TRANSITION = {
  animation: "slide_from_right" as const,
  duration: 300,
  easing: Easing.inOut(Easing.quad),
};
