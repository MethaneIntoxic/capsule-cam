// src/screens/ImagePickerScreen.tsx
// Camera capture or gallery selection with caption input and crop toggle.

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
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropMode, setCropMode] = useState<"square" | "portrait">("square");

  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        // We'll handle denial gracefully when user tries to take a photo
      }
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: cropMode === "square" ? [1, 1] : [3, 4],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Capsule Cam needs access to your photo library."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: cropMode === "square" ? [1, 1] : [3, 4],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleInsert = () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    // Navigate to machine screen with the image
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
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crop & Caption</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Image Preview */}
        <View style={styles.previewContainer}>
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
            <View style={styles.previewPlaceholder}>
              <Text style={styles.previewPlaceholderIcon}>📷</Text>
              <Text style={styles.previewPlaceholderText}>
                Take a photo or choose{'\n'}from gallery
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
            <Text style={styles.actionBtnIcon}>📸</Text>
            <Text style={styles.actionBtnText}>Take{'\n'}Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={pickFromGallery}>
            <Text style={styles.actionBtnIcon}>🖼️</Text>
            <Text style={styles.actionBtnText}>Choose{'\n'}Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Caption Input */}
        <TextInput
          style={styles.captionInput}
          placeholder="Add a caption..."
          placeholderTextColor="#666"
          value={caption}
          onChangeText={setCaption}
          maxLength={60}
        />

        {/* Crop Toggle */}
        <TouchableOpacity
          style={styles.cropToggle}
          onPress={() => setCropMode(cropMode === "square" ? "portrait" : "square")}
        >
          <Text style={styles.cropToggleText}>
            {cropMode === "square" ? "◻️ Crop: Square" : "▯ Crop: Portrait"}
          </Text>
        </TouchableOpacity>

        {/* Insert Button */}
        <TouchableOpacity
          style={[styles.insertBtn, !selectedImage && styles.insertBtnDisabled]}
          onPress={handleInsert}
          disabled={!selectedImage || isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.insertBtnText}>▶️ Insert into Machine</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  content: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: { fontSize: 16, color: "#FFD700" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#FFF" },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  previewImage: { borderRadius: 12 },
  previewSquare: { width: "100%", aspectRatio: 1 },
  previewPortrait: { width: "80%", aspectRatio: 3 / 4 },
  previewPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    borderStyle: "dashed",
  },
  previewPlaceholderIcon: { fontSize: 48, marginBottom: 12 },
  previewPlaceholderText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    gap: 6,
  },
  actionBtnIcon: { fontSize: 28 },
  actionBtnText: { fontSize: 13, fontWeight: "600", color: "#FFF", textAlign: "center" },
  captionInput: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#FFF",
    marginBottom: 12,
  },
  cropToggle: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    marginBottom: 16,
  },
  cropToggleText: { fontSize: 14, color: "#B0B0B0" },
  insertBtn: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#D32F2F",
    alignItems: "center",
  },
  insertBtnDisabled: { opacity: 0.4 },
  insertBtnText: { fontSize: 18, fontWeight: "700", color: "#FFF" },
});
