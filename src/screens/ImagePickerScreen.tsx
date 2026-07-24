// src/screens/ImagePickerScreen.tsx
// High-End SLR Viewfinder — Photo capture & film stock selection.

import React, { useState, useEffect, useCallback } from "react";
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
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHaptics } from "../hooks/useHaptics";
import { useSound } from "../hooks/useSound";
import { useAndroidBackHandler } from "../hooks/useAndroidBackHandler";
import BottomTabBar from "../components/BottomTabBar";
import FilmFilterOverlay from "../components/FilmFilterOverlay";
import { FilmFilterId, FILM_FILTERS } from "../models/FilmFilter";

let ImagePickerModule: typeof import("expo-image-picker") | null = null;
try {
  ImagePickerModule = require("expo-image-picker");
} catch {
  // Web fallback
}

const SAMPLE_PRESET_IMAGES = [
  { label: "KODAK PORTRA", uri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop" },
  { label: "FUJI SUPERIA", uri: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop" },
  { label: "CINESTILL 800", uri: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop" },
  { label: "ILFORD B&W", uri: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=600&auto=format&fit=crop" },
];

export default function ImagePickerScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const sound = useSound();
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_PRESET_IMAGES[0]?.uri ?? null);
  const [caption, setCaption] = useState("LEICA M3 MEMORY ✦");
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
    haptics.selection();
    sound.play("handleClick");
    if (!ImagePickerModule) {
      Alert.alert("Camera Notice", "Select a film stock sample below!");
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
        haptics.activate();
      }
    } catch {
      Alert.alert("Camera Notice", "Select a film stock sample below!");
    }
  };

  const pickFromGallery = async () => {
    haptics.selection();
    sound.play("handleClick");
    if (!ImagePickerModule) {
      Alert.alert("Gallery Notice", "Select a film stock sample below!");
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
        haptics.activate();
      }
    } catch {
      Alert.alert("Gallery Notice", "Select a sample below!");
    }
  };

  const [selectedFilter, setSelectedFilter] = useState<FilmFilterId>("kodachrome");

  const handleInsert = () => {
    if (!selectedImage) return;
    haptics.heavyLock();
    sound.play("handleClick");
    setIsProcessing(true);
    router.push({
      pathname: "/machine",
      params: {
        imageUri: selectedImage,
        caption: caption.trim() || undefined,
        filmFilter: selectedFilter,
      },
    });
  };

  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === "ios" ? 44 : 24);

  const handleAndroidBack = useCallback(() => {
    router.replace("/");
    return true;
  }, [router]);

  useAndroidBackHandler(handleAndroidBack);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: topInset + 8, paddingBottom: 110 }]}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              haptics.selection();
              router.replace("/studio");
            }}
          >
            <Text style={styles.backBtnText}>← STUDIO</Text>
          </TouchableOpacity>
          <View style={styles.titleBadge}>
            <Text style={styles.headerTitle}>SLR VIEWFINDER</Text>
          </View>
          <View style={{ width: 70 }} />
        </View>

        {/* Viewfinder Frame Overlay */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.hudTopRow}>
            <Text style={styles.hudBadge}>ISO 400</Text>
            <Text style={styles.hudBadge}>1/500S</Text>
            <Text style={[styles.hudBadge, { color: "#D4AF37" }]}>FRAME 01/36</Text>
          </View>

          {/* Viewfinder Target */}
          <View style={styles.previewBox}>
            {selectedImage ? (
              <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center", position: "relative" }}>
                <Image
                  source={{ uri: selectedImage }}
                  style={[
                    styles.previewImage,
                    cropMode === "square" ? styles.previewSquare : styles.previewPortrait,
                  ]}
                  resizeMode="cover"
                />
                <FilmFilterOverlay filterId={selectedFilter} showBadge={true} />
              </View>
            ) : (
              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderIcon}>◈</Text>
                <Text style={styles.placeholderText}>NO FRAME LOADED</Text>
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
          <TouchableOpacity style={styles.actionBtn} onPress={takePhoto} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionText}>SHUTTER</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={pickFromGallery} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>🖼️</Text>
            <Text style={styles.actionText}>GALLERY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              haptics.selection();
              sound.play("handleClick");
              setCropMode(cropMode === "square" ? "portrait" : "square");
            }}
            activeOpacity={0.8}
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
          <Text style={styles.presetsTitle}>FILM STOCK EMULATION & SAMPLE FRAMES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsList}>
            {SAMPLE_PRESET_IMAGES.map((preset, idx) => {
              const isActive = selectedImage === preset.uri;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.presetChip,
                    isActive && styles.presetChipActive,
                  ]}
                  onPress={() => {
                    haptics.selection();
                    sound.play("handleClick");
                    setSelectedImage(preset.uri);
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: preset.uri }} style={styles.presetThumb} />
                  <Text style={[styles.presetText, isActive && styles.presetTextActive]}>{preset.label}</Text>
                  {isActive && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            })}
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
            <Text style={styles.feedBtnText}>✦ LOAD FRAME INTO GASHAPON →</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Bottom Tab Navigation */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0E12", overflow: "hidden" },
  content: { padding: 18, paddingBottom: 110, gap: 14 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  backBtnText: { fontSize: 11, fontWeight: "900", color: "#D4AF37", letterSpacing: 1.5 },
  titleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#16161C",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  headerTitle: { fontSize: 13, fontWeight: "900", color: "#E2DFD7", letterSpacing: 2 },
  viewfinderContainer: {
    backgroundColor: "#16161C",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
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
    letterSpacing: 1.5,
  },
  previewBox: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#0A0A0E",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  previewImage: { borderRadius: 12 },
  previewSquare: { width: "94%", height: "94%" },
  previewPortrait: { width: "75%", height: "94%" },
  placeholderBox: { justifyContent: "center", alignItems: "center" },
  placeholderIcon: { fontSize: 32, color: "#D4AF37", marginBottom: 8 },
  placeholderText: { fontSize: 11, fontWeight: "900", color: "#666", letterSpacing: 1.5 },
  crosshairTL: { position: "absolute", top: 12, left: 12, width: 14, height: 14, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#D4AF37" },
  crosshairTR: { position: "absolute", top: 12, right: 12, width: 14, height: 14, borderTopWidth: 2, borderRightWidth: 2, borderColor: "#D4AF37" },
  crosshairBL: { position: "absolute", bottom: 12, left: 12, width: 14, height: 14, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "#D4AF37" },
  crosshairBR: { position: "absolute", bottom: 12, right: 12, width: 14, height: 14, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#D4AF37" },
  dateStamp: { position: "absolute", bottom: 14, right: 16, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  dateStampText: { fontSize: 11, fontWeight: "900", color: "#FF5E36", fontFamily: "monospace" },
  actionRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: "#16161C",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    gap: 4,
  },
  actionIcon: { fontSize: 18 },
  actionText: { fontSize: 10, fontWeight: "900", color: "#E2DFD7", letterSpacing: 1 },
  inputCard: {
    backgroundColor: "#16161C",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  inputLabel: { fontSize: 10, fontWeight: "900", color: "#D4AF37", letterSpacing: 1.5, marginBottom: 8 },
  captionInput: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
    backgroundColor: "#0A0A0E",
  },
  presetsSection: { gap: 8 },
  presetsTitle: { fontSize: 11, fontWeight: "900", color: "#00E5FF", letterSpacing: 1.5 },
  presetsList: { gap: 10 },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16161C",
    paddingRight: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 8,
  },
  presetChipActive: { borderColor: "#D4AF37", backgroundColor: "#22222B" },
  presetThumb: { width: 34, height: 34, borderRadius: 10 },
  presetText: { fontSize: 10, fontWeight: "900", color: "#E2DFD7", letterSpacing: 1 },
  presetTextActive: { color: "#D4AF37" },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D4AF37",
  },
  feedBtn: {
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "#C8372D",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    shadowColor: "#C8372D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  feedBtnDisabled: { opacity: 0.4 },
  feedBtnText: { fontSize: 15, fontWeight: "900", color: "#FFF", letterSpacing: 1.5 },
});
