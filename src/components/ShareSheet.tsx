// src/components/ShareSheet.tsx
// Placeholder for Phase 4 — export format picker + share trigger.

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Capsule } from "../models/Capsule";
import { useHaptics } from "../hooks/useHaptics";

interface ShareSheetProps {
  capsule: Capsule;
}

export default function ShareSheet({ capsule }: ShareSheetProps) {
  const haptics = useHaptics();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    haptics.selection();
    const shareData = {
      title: "Capsule Cam Memory ✦",
      text: `Check out my ${capsule.rarity.toUpperCase()} 35mm photo capsule "${capsule.caption ?? "Analog Memory"}" on Capsule Cam!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    haptics.activate();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✦ SHARE PHOTO CAPSULE ✦</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.buttonText}>📲 IG / TIKTOK STORY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleCopyLink} activeOpacity={0.8}>
          <Text style={styles.secondaryText}>{copied ? "✓ LINK COPIED!" : "🔗 COPY LINK"}</Text>
        </TouchableOpacity>
      </View>
      {copied && (
        <View style={styles.toastBanner}>
          <Text style={styles.toastText}>✓ Link copied to clipboard! Share on Instagram & TikTok.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: "#13141A",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(212, 175, 55, 0.4)",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  title: {
    fontSize: 10,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 2,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#C8372D",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    alignItems: "center",
    shadowColor: "#C8372D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  secondaryButton: {
    backgroundColor: "#1E1F28",
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
  },
  buttonText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1.5,
  },
  secondaryText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 1,
  },
  toastBanner: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4AF37",
    marginTop: 4,
  },
  toastText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#D4AF37",
    textAlign: "center",
  },
});
