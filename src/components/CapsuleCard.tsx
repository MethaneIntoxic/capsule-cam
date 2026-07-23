// src/components/CapsuleCard.tsx
// Revealed photo card — shows the image, caption, date, and rarity.

import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Capsule } from "../models/Capsule";
import { CAPSULE_COLOR_HEX } from "../models/Capsule";
import { RARITY_TABLE } from "../models/Rarity";
import RarityBadge from "./RarityBadge";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width - 60, 320);

interface CapsuleCardProps {
  capsule: Capsule;
}

export default function CapsuleCard({ capsule }: CapsuleCardProps) {
  const colorHex = CAPSULE_COLOR_HEX[capsule.capsuleColor] ?? "#FAFAFA";
  const rarityConfig = RARITY_TABLE.find((r) => r.rarity === capsule.rarity);

  const formattedDate = capsule.createdAt
    ? new Date(capsule.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <View
      style={[
        styles.card,
        { borderColor: rarityConfig?.borderColor ?? "#C0C0C0" },
      ]}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: capsule.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.infoTop}>
          <RarityBadge rarity={capsule.rarity} />
          <View
            style={[
              styles.colorDot,
              { backgroundColor: colorHex },
            ]}
          />
        </View>

        {capsule.caption && (
          <Text style={styles.caption} numberOfLines={2}>
            {capsule.caption}
          </Text>
        )}

        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    backgroundColor: "#1E1E32",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 16,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    padding: 16,
    gap: 8,
  },
  infoTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  caption: {
    fontSize: 15,
    color: "#FFF",
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: "#B0B0B0",
  },
});
