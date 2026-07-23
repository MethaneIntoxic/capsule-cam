// src/components/CapsuleThumbnail.tsx
// Small circular capsule thumbnail for grid and recent views.

import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Capsule, CAPSULE_COLOR_HEX } from "../models/Capsule";
import { RARITY_TABLE } from "../models/Rarity";

interface CapsuleThumbnailProps {
  capsule: Capsule;
  size: number;
  onPress?: () => void;
}

export default function CapsuleThumbnail({ capsule, size, onPress }: CapsuleThumbnailProps) {
  const colorHex = CAPSULE_COLOR_HEX[capsule.capsuleColor] ?? "#FAFAFA";
  const rarityConfig = RARITY_TABLE.find((r) => r.rarity === capsule.rarity);
  const borderColor = rarityConfig?.borderColor ?? "#C0C0C0";

  const Content = (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          backgroundColor: colorHex,
        },
      ]}
    >
      {/* Small image preview inside capsule */}
      <Image
        source={{ uri: capsule.thumbnailUri }}
        style={[
          styles.image,
          {
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: size * 0.3,
          },
        ]}
        resizeMode="cover"
      />
      {/* Gloss */}
      <View
        style={[
          styles.gloss,
          {
            top: size * 0.1,
            left: size * 0.2,
            right: size * 0.2,
            height: size * 0.15,
            borderRadius: size * 0.075,
          },
        ]}
      />
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{Content}</TouchableOpacity>;
  }
  return Content;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    overflow: "hidden",
  },
  gloss: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.25)",
  },
});
