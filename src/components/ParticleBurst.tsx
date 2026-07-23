// src/components/ParticleBurst.tsx
// Placeholder for Phase 2 — confetti/starburst particles on reveal.

import React from "react";
import { View, StyleSheet } from "react-native";

interface ParticleBurstProps {
  color: string;
  isVisible: boolean;
}

export default function ParticleBurst({ color, isVisible }: ParticleBurstProps) {
  if (!isVisible) return null;

  // Phase 2: implement animated particles
  return (
    <View style={styles.container}>
      <View style={[styles.particle, { backgroundColor: color }]} />
      <View style={[styles.particle, styles.particle2, { backgroundColor: color }]} />
      <View style={[styles.particle, styles.particle3, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  particle2: {
    marginLeft: -30,
    marginTop: -20,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  particle3: {
    marginLeft: 30,
    marginTop: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
