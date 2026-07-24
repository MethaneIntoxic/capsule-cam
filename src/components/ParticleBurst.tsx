// src/components/ParticleBurst.tsx
// Placeholder for Phase 2 — confetti/starburst particles on reveal.

import React from "react";
import { View, StyleSheet } from "react-native";

interface ParticleBurstProps {
  color: string;
  isVisible: boolean;
}

const PARTICLE_POSITIONS = [
  { x: -60, y: -80, size: 8, color: "#D4AF37" },
  { x: 60, y: -70, size: 10, color: "#FFF" },
  { x: -90, y: 10, size: 6, color: "#00E5FF" },
  { x: 90, y: 20, size: 9, color: "#E040FB" },
  { x: -40, y: 90, size: 7, color: "#FFD700" },
  { x: 40, y: 80, size: 8, color: "#FFF" },
  { x: -110, y: -40, size: 11, color: "#D4AF37" },
  { x: 110, y: -30, size: 6, color: "#00E5FF" },
  { x: 0, y: -110, size: 10, color: "#FFF" },
  { x: 0, y: 110, size: 8, color: "#FFB74D" },
  { x: -70, y: -120, size: 7, color: "#E040FB" },
  { x: 70, y: -110, size: 9, color: "#D4AF37" },
  { x: -130, y: 40, size: 10, color: "#FF5E36" },
  { x: 130, y: 50, size: 8, color: "#00F0FF" },
  { x: -30, y: -140, size: 12, color: "#FFD700" },
  { x: 30, y: -130, size: 9, color: "#FFF" },
  { x: -100, y: 110, size: 8, color: "#E040FB" },
  { x: 100, y: 100, size: 10, color: "#D4AF37" },
  { x: -150, y: -80, size: 7, color: "#00E5FF" },
  { x: 150, y: -70, size: 8, color: "#FFF" },
  { x: -50, y: 140, size: 9, color: "#FFB74D" },
  { x: 50, y: 130, size: 11, color: "#FFD700" },
  { x: -120, y: -120, size: 8, color: "#FFF" },
  { x: 120, y: -120, size: 7, color: "#E040FB" },
];

export default function ParticleBurst({ color, isVisible }: ParticleBurstProps) {
  if (!isVisible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {PARTICLE_POSITIONS.map((p, idx) => (
        <View
          key={idx}
          style={[
            styles.particle,
            {
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              transform: [{ translateX: p.x }, { translateY: p.y }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  particle: {
    position: "absolute",
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});
