// src/components/CreateButton.tsx
// Large home-screen CTA button.

import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface CreateButtonProps {
  onPress: () => void;
}

export default function CreateButton({ onPress }: CreateButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>✨</Text>
      <Text style={styles.text}>Create a Capsule</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    width: Math.min(width - 48, 280),
    height: 72,
    backgroundColor: "#D32F2F",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  icon: {
    fontSize: 28,
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
