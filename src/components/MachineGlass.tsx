// src/components/MachineGlass.tsx
// Transparent compartment dome — shows floating mini-capsules and user image preview inside the machine.

import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { MachineThemeConfig } from "../models/MachineTheme";
import { CAPSULE_COLOR_HEX, CapsuleColor } from "../models/Capsule";

interface MachineGlassProps {
  theme: MachineThemeConfig;
  imageUri?: string;
  isVisible?: boolean;
}

const DOME_MINI_CAPSULES: { color: CapsuleColor; left: number; bottom: number; rotation: string; size: number }[] = [
  { color: "pink", left: 24, bottom: 18, rotation: "-25deg", size: 36 },
  { color: "yellow", left: 62, bottom: 12, rotation: "15deg", size: 40 },
  { color: "blue", left: 106, bottom: 16, rotation: "-10deg", size: 38 },
  { color: "purple", left: 148, bottom: 22, rotation: "30deg", size: 34 },
  { color: "white", left: 44, bottom: 42, rotation: "40deg", size: 32 },
  { color: "green", left: 90, bottom: 48, rotation: "-35deg", size: 36 },
  { color: "orange", left: 130, bottom: 44, rotation: "12deg", size: 34 },
];

export default function MachineGlass({ theme, imageUri, isVisible = true }: MachineGlassProps) {
  return (
    <View style={[styles.glassDome, { backgroundColor: theme.glassColor }]}>
      {/* Curved glass shine reflection overlay */}
      <View style={styles.glassReflectionTop} />
      <View style={styles.glassReflectionSide} />

      {/* Mini capsules resting inside the dome */}
      {DOME_MINI_CAPSULES.map((item, idx) => (
        <View
          key={idx}
          style={[
            styles.miniCapsule,
            {
              backgroundColor: CAPSULE_COLOR_HEX[item.color],
              left: item.left,
              bottom: item.bottom,
              width: item.size,
              height: item.size,
              borderRadius: item.size / 2,
              transform: [{ rotate: item.rotation }],
            },
          ]}
        >
          <View style={styles.miniCapsuleTopHalf} />
          <View style={styles.miniCapsuleGloss} />
        </View>
      ))}

      {/* Image Preview floating in dome */}
      {isVisible && imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          <View style={styles.imageOverlayGloss} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  glassDome: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#D4AF37",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  glassReflectionTop: {
    position: "absolute",
    top: 8,
    left: 28,
    width: 150,
    height: 38,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    transform: [{ rotate: "-15deg" }],
    zIndex: 10,
  },
  glassReflectionSide: {
    position: "absolute",
    bottom: 20,
    right: 12,
    width: 20,
    height: 90,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    transform: [{ rotate: "25deg" }],
    zIndex: 10,
  },
  miniCapsule: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  miniCapsuleTopHalf: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  miniCapsuleGloss: {
    position: "absolute",
    top: 3,
    left: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  imageContainer: {
    width: 134,
    height: 134,
    borderRadius: 67,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#D4AF37",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    zIndex: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlayGloss: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});
