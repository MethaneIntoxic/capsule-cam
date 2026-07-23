// src/components/RarityBadge.tsx
// Small pill badge showing capsule rarity with colour.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Rarity } from "../models/Capsule";
import { RARITY_TABLE } from "../models/Rarity";

interface RarityBadgeProps {
  rarity: Rarity;
}

export default function RarityBadge({ rarity }: RarityBadgeProps) {
  const config = RARITY_TABLE.find((r) => r.rarity === rarity);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: (config?.borderColor ?? "#666") + "33" },
        { borderColor: config?.borderColor ?? "#C0C0C0" },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: config?.borderColor ?? "#C0C0C0" },
        ]}
      >
        {config?.label ?? rarity}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
