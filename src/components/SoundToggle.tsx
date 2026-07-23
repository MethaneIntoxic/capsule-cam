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
    <TouchableOpacity style={styles.button} onPress={onToggle}>
      <Text style={styles.icon}>{isMuted ? "🔇" : "🔊"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    fontSize: 22,
  },
});
