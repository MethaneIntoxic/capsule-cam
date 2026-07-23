// src/components/SoundToggle.tsx
// Mute/unmute icon button.

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ isMuted, onToggle }: SoundToggleProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onToggle} activeOpacity={0.8}>
      <Text style={styles.icon}>{isMuted ? "🔇" : "🔊"}</Text>
      <Text style={styles.label}>{isMuted ? "MUTED" : "SOUND ON"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#15161C",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: 9,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 1,
  },
});
