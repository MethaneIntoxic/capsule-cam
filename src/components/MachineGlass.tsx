// src/components/MachineGlass.tsx
// Transparent compartment dome — shows the user's image inside the machine.

import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { MachineThemeConfig } from "../models/MachineTheme";

interface MachineGlassProps {
  theme: MachineThemeConfig;
  imageUri: string;
  isVisible: boolean;
}

export default function MachineGlass({ theme, imageUri, isVisible }: MachineGlassProps) {
  return (
    <View style={[styles.glass, { backgroundColor: theme.glassColor }]}>
      {isVisible && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
