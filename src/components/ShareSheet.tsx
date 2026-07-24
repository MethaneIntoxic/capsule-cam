// src/components/ShareSheet.tsx
// Compact horizontal share actions pair for social media export.

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
      <TouchableOpacity style={styles.button} onPress={handleShare} activeOpacity={0.8}>
        <Text style={styles.buttonText}>📲 SHARE STORY</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleCopyLink} activeOpacity={0.8}>
        <Text style={styles.secondaryText}>{copied ? "✓ COPIED!" : "🔗 COPY LINK"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#C8372D",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#16161C",
    borderColor: "rgba(255,255,255,0.15)",
  },
  buttonText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1,
  },
  secondaryText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 1,
  },
});
