// src/screens/ImagePickerScreen.tsx
// Analog Camera Viewfinder — Photo capture / gallery picker with retro HUD & caption stamp.

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

let ImagePickerModule: typeof import("expo-image-picker") | null = null;
try {
  ImagePickerModule = require("expo-image-picker");
} catch {
  // Native module unavailable
}

const SAMPLE_PRESET_IMAGES = [
  { label: "Retro Cat 🐱", uri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop" },
  { label: "Tokyo Neon 🌆", uri: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop" },
  { label: "Sunset Vibes 🌅", uri: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop" },
  { label: "Vintage Skate 🛹", uri: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=600&auto=format&fit=crop" },
];

export default function ImagePickerScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_PRESET_IMAGES[0]?.uri ?? null);
  const [caption, setCaption] = useState("VIBIN' IN THE ARCADE ✦");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropMode, setCropMode] = useState<"square" | "portrait">("square");

  useEffect(() => {
    (async () => {
      if (ImagePickerModule) {
        await ImagePickerModule.requestCameraPermissionsAsync();
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (!ImagePickerModule) {
      Alert.alert("Camera Warning", "Camera hardware not detected. Select a preset below!");
      return;
    }
    try {
      const result = await ImagePickerModule.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: cropMode === "square" ? [1, 1] : [3, 4],
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Camera Notice", "Using preset photo selection!");
    }
  };

  const pickFromGallery = async () => {
    if (!ImagePickerModule) {
      Alert.alert("Gallery Warning", "Gallery not available. Select a preset below!");
      return;
    }
    try {
      const { status } = await ImagePickerModule.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Photo library access is required.");
        return;
      }
      const result = await ImagePickerModule.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: cropMode === "square" ? [1, 1] : [3, 4],
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Gallery Notice", "Select a sample preset below!");
    }
  };

  const handleInsert = () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    router.push({
      pathname: "/machine",
      params: {
        imageUri: selectedImage,
        caption: caption.trim() || undefined,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← BACK</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CAMERA VIEWFINDER</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Viewfinder Frame Overlay */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.hudTopRow}>
            <Text style={styles.hudBadge}>ISO 400</Text>
            <Text style={styles.hudBadge}>1/250s</Text>
            <Text style={[styles.hudBadge, { color: "#FFD700" }]}>EXP 01/36</Text>
          </View>

          {/* Viewfinder Target */}
          <View style={styles.previewBox}>
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={[
                  styles.previewImage,
                  cropMode === "square" ? styles.previewSquare : styles.previewPortrait,
                ]}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderIcon}>📷</Text>
                <Text style={styles.placeholderText}>NO PHOTO SELECTED</Text>
              </View>
            )}

            {/* Viewfinder Crosshair Grid */}
            <View style={styles.crosshairTL} />
            <View style={styles.crosshairTR} />
            <View style={styles.crosshairBL} />
            <View style={styles.crosshairBR} />

            {/* Retro Date Stamp */}
            <View style={styles.dateStamp}>
              <Text style={styles.dateStampText}>'98 07 23</Text>
            </View>
          </View>
        </View>

        {/* Actions Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionText}>SHUTTER</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={pickFromGallery}>
            <Text style={styles.actionIcon}>🖼️</Text>
            <Text style={styles.actionText}>GALLERY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setCropMode(cropMode === "square" ? "portrait" : "square")}
          >
            <Text style={styles.actionIcon}>📐</Text>
            <Text style={styles.actionText}>
              {cropMode === "square" ? "1:1 SQUARE" : "3:4 PORTRAIT"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Caption Stamp Input */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>CAPTION STAMP (MAX 60 CHARS)</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a memory..."
            placeholderTextColor="#666"
            value={caption}
            onChangeText={setCaption}
            maxLength={60}
          />
        </View>

        {/* Preset Photos Selection Bar */}
        <View style={styles.presetsSection}>
          <Text style={styles.presetsTitle}>SAMPLE PHOTOS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsList}>
            {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.presetChip,
                  selectedImage === preset.uri && styles.presetChipActive,
                ]}
                onPress={() => setSelectedImage(preset.uri)}
              >
                <Image source={{ uri: preset.uri }} style={styles.presetThumb} />
                <Text style={styles.presetText}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Feed into Machine Button */}
        <TouchableOpacity
          style={[styles.feedBtn, !selectedImage && styles.feedBtnDisabled]}
          onPress={handleInsert}
          disabled={!selectedImage || isProcessing}
          activeOpacity={0.85}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.feedBtnText}>🎰 FEED PHOTO INTO MACHINE →</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0D15" },
  content: { padding: 20, gap: 14 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  backBtnText: { fontSize: 12, fontWeight: "800", color: "#FFB703" },
  headerTitle: { fontSize: 15, fontWeight: "900", color: "#FFF", letterSpacing: 1.5 },
  viewfinderContainer: {
    backgroundColor: "#161522",
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
  },
  hudTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  hudBadge: {
    fontSize: 10,
    fontWeight: "900",
    color: "#00E5FF",
    letterSpacing: 1,
  },
  previewBox: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#0A0910",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "#FFB703",
  },
  previewImage: { borderRadius: 12 },
  previewSquare: { width: "94%", height: "94%" },
  previewPortrait: { width: "75%", height: "94%" },
  placeholderBox: { justifyContent: "center", alignItems: "center" },
  placeholderIcon: { fontSize: 40, marginBottom: 8 },
  placeholderText: { fontSize: 12, fontWeight: "800", color: "#666", letterSpacing: 1 },
  crosshairTL: { position: "absolute", top: 10, left: 10, width: 14, height: 14, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#FFB703" },
  crosshairTR: { position: "absolute", top: 10, right: 10, width: 14, height: 14, borderTopWidth: 2, borderRightWidth: 2, borderColor: "#FFB703" },
  crosshairBL: { position: "absolute", bottom: 10, left: 10, width: 14, height: 14, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "#FFB703" },
  crosshairBR: { position: "absolute", bottom: 10, right: 10, width: 14, height: 14, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#FFB703" },
  dateStamp: { position: "absolute", bottom: 14, right: 16, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dateStampText: { fontSize: 12, fontWeight: "900", color: "#FF5E36", fontFamily: "monospace" },
  actionRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: "#1D182A",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    gap: 4,
  },
  actionIcon: { fontSize: 20 },
  actionText: { fontSize: 10, fontWeight: "900", color: "#FFF", letterSpacing: 0.5 },
  inputCard: {
    backgroundColor: "#161522",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  inputLabel: { fontSize: 10, fontWeight: "800", color: "#FFB703", letterSpacing: 1, marginBottom: 8 },
  captionInput: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
    backgroundColor: "#0D0E15",
  },
  presetsSection: { gap: 8 },
  presetsTitle: { fontSize: 11, fontWeight: "800", color: "#00E5FF", letterSpacing: 1 },
  presetsList: { gap: 10 },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161522",
    paddingRight: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 8,
  },
  presetChipActive: { borderColor: "#FFB703", backgroundColor: "#252033" },
  presetThumb: { width: 32, height: 32, borderRadius: 8 },
  presetText: { fontSize: 11, fontWeight: "800", color: "#FFF" },
  feedBtn: {
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "#E63946",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFB703",
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  feedBtnDisabled: { opacity: 0.4 },
  feedBtnText: { fontSize: 16, fontWeight: "900", color: "#FFF", letterSpacing: 1 },
});
