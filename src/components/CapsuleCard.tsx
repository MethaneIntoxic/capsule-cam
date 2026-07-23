// src/components/CapsuleCard.tsx
// Revealed photo card — Polaroid / instant film retro card with rarity foil sheen.

import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Capsule, CAPSULE_COLOR_HEX } from "../models/Capsule";
import { RARITY_TABLE } from "../models/Rarity";
import RarityBadge from "./RarityBadge";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width - 48, 330);

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
    : "JUL 23 2026";

  const isSpecial = capsule.rarity === "special";
  const isRare = capsule.rarity === "rare";

  return (
    <View
      style={[
        styles.cardFrame,
        isSpecial && styles.cardSpecialFrame,
        isRare && styles.cardRareFrame,
      ]}
    >
      {/* Decorative Washi Tape Accent */}
      <View style={styles.washiTape} />

      {/* Main Polaroid Body */}
      <View style={styles.polaroidBody}>
        {/* Photo Container */}
        <View style={styles.imageBox}>
          <Image
            source={{ uri: capsule.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Film Grain & Gloss Sheen */}
          <View style={styles.imageGlossOverlay} />

          {/* Date Stamp */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>'98 07 23</Text>
          </View>
        </View>

        {/* Info & Caption Area (Bottom of Polaroid) */}
        <View style={styles.bottomSection}>
          <View style={styles.metaRow}>
            <RarityBadge rarity={capsule.rarity} />
            <View style={styles.colorTag}>
              <View style={[styles.colorDot, { backgroundColor: colorHex }]} />
              <Text style={styles.colorName}>{capsule.capsuleColor.toUpperCase()}</Text>
            </View>
          </View>

          {capsule.caption ? (
            <Text style={styles.captionText} numberOfLines={2}>
              "{capsule.caption}"
            </Text>
          ) : (
            <Text style={styles.defaultCaption}>✦ MEMORY CAPSULE ✦</Text>
          )}

          <View style={styles.footerRow}>
            <Text style={styles.stampText}>CAPSULE CAM #098</Text>
            <Text style={styles.dateSub}>{formattedDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardFrame: {
    width: CARD_WIDTH,
    borderRadius: 24,
    backgroundColor: "#FDFBF7",
    padding: 12,
    borderWidth: 3,
    borderColor: "#E2D9C8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 16,
    position: "relative",
  },
  cardRareFrame: {
    borderColor: "#00E5FF",
    backgroundColor: "#F4FAFF",
  },
  cardSpecialFrame: {
    borderColor: "#FFD700",
    backgroundColor: "#FFFDF0",
  },
  washiTape: {
    position: "absolute",
    top: -12,
    alignSelf: "center",
    width: 90,
    height: 22,
    backgroundColor: "rgba(255, 183, 3, 0.75)",
    borderRadius: 4,
    transform: [{ rotate: "-2deg" }],
    zIndex: 10,
  },
  polaroidBody: {
    width: "100%",
    alignItems: "center",
  },
  imageBox: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGlossOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  dateBadge: {
    position: "absolute",
    bottom: 10,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FF5E36",
    fontFamily: "monospace",
  },
  bottomSection: {
    width: "100%",
    paddingTop: 14,
    paddingHorizontal: 4,
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EAE3D2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
  colorName: {
    fontSize: 10,
    fontWeight: "900",
    color: "#333",
    letterSpacing: 0.5,
  },
  captionText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A2E",
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: 2,
  },
  defaultCaption: {
    fontSize: 12,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 1,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    paddingTop: 6,
  },
  stampText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#888",
    letterSpacing: 1,
  },
  dateSub: {
    fontSize: 10,
    fontWeight: "700",
    color: "#666",
  },
});
