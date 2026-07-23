// src/components/ShareSheet.tsx
// Placeholder for Phase 4 — export format picker + share trigger.

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ShareSheetProps {
  capsuleId: string;
}

export default function ShareSheet({ capsuleId: _capsuleId }: ShareSheetProps) {
  // TODO: Phase 4 — implement export and sharing
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sharing coming soon</Text>
      <TouchableOpacity style={styles.button} disabled>
        <Text style={styles.buttonText}>📤 Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  text: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
