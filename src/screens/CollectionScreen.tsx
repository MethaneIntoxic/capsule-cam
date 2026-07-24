// src/screens/CollectionScreen.tsx
// High-End Collector Binder — displays saved capsules in a precision grid.

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionContext } from "../state/CollectionContext";
import { useHaptics } from "../hooks/useHaptics";
import { useSound } from "../hooks/useSound";
import { useAndroidBackHandler } from "../hooks/useAndroidBackHandler";
import { Capsule, Rarity } from "../models/Capsule";
import { RARITY_TABLE } from "../models/Rarity";
import CapsuleThumbnail from "../components/CapsuleThumbnail";
import BottomTabBar from "../components/BottomTabBar";

const { width } = Dimensions.get("window");
const COLUMNS = 3;
const ITEM_SPACING = 12;
const ITEM_SIZE = (width - 40 - ITEM_SPACING * (COLUMNS - 1)) / COLUMNS;

type FilterOption = "all" | Rarity;

export default function CollectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const sound = useSound();
  const { capsules, removeCapsule, refresh } = useCollectionContext();
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const filteredCapsules =
    activeFilter === "all"
      ? capsules
      : capsules.filter((c) => c.rarity === activeFilter);

  const handleDelete = useCallback(
    (capsule: Capsule) => {
      haptics.heavyLock();
      sound.play("handleClick");
      Alert.alert(
        "Delete Capsule",
        "This capsule will be permanently removed from your binder.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              haptics.impact();
              removeCapsule(capsule.id);
            },
          },
        ]
      );
    },
    [removeCapsule, haptics, sound]
  );

  const renderItem = useCallback(
    ({ item }: { item: Capsule }) => (
      <TouchableOpacity
        onPress={() => {
          haptics.selection();
          sound.play("handleClick");
          router.push({
            pathname: "/reveal",
            params: { capsuleId: item.id },
          });
        }}
        onLongPress={() => handleDelete(item)}
        activeOpacity={0.85}
      >
        <CapsuleThumbnail capsule={item} size={ITEM_SIZE} />
      </TouchableOpacity>
    ),
    [router, handleDelete, haptics, sound, ITEM_SIZE]
  );

  const filterTabs: { key: FilterOption; label: string }[] = [
    { key: "all", label: "ALL" },
    ...RARITY_TABLE.map((r) => ({
      key: r.rarity as FilterOption,
      label: r.label.toUpperCase(),
    })),
  ];

  const handleAndroidBack = useCallback(() => {
    router.replace("/");
    return true;
  }, [router]);

  useAndroidBackHandler(handleAndroidBack);

  const topInset = Math.max(insets.top, Platform.OS === "ios" ? 44 : 24);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: topInset + 8 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtnContainer}
            onPress={() => {
              haptics.selection();
              router.replace("/");
            }}
          >
            <Text style={styles.backBtn}>← STUDIO</Text>
          </TouchableOpacity>
          <View style={styles.titleBadge}>
            <Text style={styles.headerTitle}>COLLECTION BINDER</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={() => {
              haptics.selection();
              refresh();
            }}
          >
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* Binder Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressTitle}>35MM FOIL BINDER PROGRESS</Text>
            <Text style={styles.progressCount}>{capsules.length} / 24 UNLOCKED</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, (capsules.length / 24) * 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                activeFilter === tab.key && styles.filterTabActive,
              ]}
              onPress={() => {
                haptics.selection();
                sound.play("handleClick");
                setActiveFilter(tab.key);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === tab.key && styles.filterTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid */}
        {filteredCapsules.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>◈</Text>
            <Text style={styles.emptyText}>No Capsules Secured</Text>
            <Text style={styles.emptySubtext}>
              Create your first 35mm capsule frame to populate your binder.
            </Text>
            <TouchableOpacity
              style={styles.createLink}
              onPress={() => {
                haptics.selection();
                sound.play("handleClick");
                router.push("/");
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.createLinkText}>✦ OPEN VIEWFINDER CAMERA</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredCapsules}
            keyExtractor={(item) => item.id}
            numColumns={COLUMNS}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.gridRow}
            renderItem={renderItem}
            getItemLayout={(_, index) => ({
              length: ITEM_SIZE + ITEM_SPACING,
              offset: (ITEM_SIZE + ITEM_SPACING) * Math.floor(index / COLUMNS),
              index,
            })}
          />
        )}
      </View>

      {/* Floating Bottom Tab Navigation */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0E12", overflow: "hidden" },
  content: { flex: 1, paddingHorizontal: 18 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtnContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  backBtn: { fontSize: 11, fontWeight: "900", color: "#D4AF37", letterSpacing: 1.5 },
  titleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#16161C",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  headerTitle: { fontSize: 13, fontWeight: "900", color: "#E2DFD7", letterSpacing: 2 },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#16161C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
  },
  refreshIcon: { fontSize: 16, color: "#D4AF37", fontWeight: "900" },
  progressCard: {
    backgroundColor: "#13141A",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "rgba(212, 175, 55, 0.3)",
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 9,
    fontWeight: "900",
    color: "#888890",
    letterSpacing: 1.5,
  },
  progressCount: {
    fontSize: 10,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 1,
  },
  progressBarTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0A0A0E",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#D4AF37",
    borderRadius: 3,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#16161C",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  filterTabActive: {
    backgroundColor: "#C8372D",
    borderColor: "#D4AF37",
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#888890",
    letterSpacing: 1,
  },
  filterTabTextActive: {
    color: "#FFFFFF",
  },
  grid: {
    paddingBottom: 110,
  },
  gridRow: {
    gap: ITEM_SPACING,
    marginBottom: ITEM_SPACING,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: { fontSize: 36, color: "#D4AF37", marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: "900", color: "#E2DFD7", marginBottom: 6, letterSpacing: 0.5 },
  emptySubtext: { fontSize: 12, color: "#777780", textAlign: "center", marginBottom: 20, paddingHorizontal: 30 },
  createLink: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: "#C8372D",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  createLinkText: { fontSize: 13, fontWeight: "900", color: "#FFF", letterSpacing: 1.5 },
});
