// src/components/FilmFilterOverlay.tsx
// Visual overlay applying analog film tint, grain, and filter badges.

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { FilmFilterId, FILM_FILTERS } from "../models/FilmFilter";

interface FilmFilterOverlayProps {
  filterId?: FilmFilterId;
  showBadge?: boolean;
}

export default function FilmFilterOverlay({ filterId = "kodachrome", showBadge = false }: FilmFilterOverlayProps) {
  const config = FILM_FILTERS[filterId] ?? FILM_FILTERS.kodachrome;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Film Tint Overlay */}
      <View
        style={[
          styles.tint,
          {
            backgroundColor: config.overlayColor,
          },
        ]}
      />
      {/* Subtle Grain & Vignette Edge */}
      <View style={styles.vignette} />

      {/* Film Filter Badge */}
      {showBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{config.badge}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tint: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
  },
  vignette: {
    ...StyleSheet.absoluteFill,
    borderWidth: 8,
    borderColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    zIndex: 3,
  },
  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D4AF37",
    zIndex: 10,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1,
  },
});
