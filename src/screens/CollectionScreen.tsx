// src/screens/CollectionScreen.tsx
// Collection shelf — displays all saved capsules in a grid.

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
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionContext } from "../state/CollectionContext";
import { Capsule, Rarity } from "../models/Capsule";
import { RARITY_TABLE } from "../models/Rarity";
import CapsuleThumbnail from "../components/CapsuleThumbnail";

const { width } = Dimensions.get("window");
const COLUMNS = 3;
const ITEM_SPACING = 12;
const ITEM_SIZE = (width - 40 - ITEM_SPACING * (COLUMNS - 1)) / COLUMNS;

type FilterOption = "all" | Rarity;

export default function CollectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { capsules, removeCapsule, refresh } = useCollectionContext();
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const filteredCapsules =
    activeFilter === "all"
      ? capsules
      : capsules.filter((c) => c.rarity === activeFilter);

  const handleDelete = useCallback(
    (capsule: Capsule) => {
      Alert.alert(
        "Delete Capsule",
        "This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => removeCapsule(capsule.id),
          },
        ]
      );
    },
    [removeCapsule]
  );

  const renderItem = useCallback(
    ({ item }: { item: Capsule }) => (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/reveal",
            params: { capsuleId: item.id },
          })
        }
        onLongPress={() => handleDelete(item)}
      >
        <CapsuleThumbnail capsule={item} size={ITEM_SIZE} />
      </TouchableOpacity>
    ),
    [router, handleDelete, ITEM_SIZE]
  );

  const filterTabs: { key: FilterOption; label: string }[] = [
    { key: "all", label: "All" },
    ...RARITY_TABLE.map((r) => ({
      key: r.rarity as FilterOption,
      label: r.label,
    })),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collection</Text>
          <TouchableOpacity onPress={refresh}>
            <Text style={styles.refreshBtn}>🔄</Text>
          </TouchableOpacity>
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
              onPress={() => setActiveFilter(tab.key)}
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
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No capsules yet.</Text>
            <Text style={styles.emptySubtext}>
              Create your first capsule!
            </Text>
            <TouchableOpacity
              style={styles.createLink}
              onPress={() => router.push("/capture")}
            >
              <Text style={styles.createLinkText}>✨ Create a Capsule</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  content: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: { fontSize: 16, color: "#FFD700" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  refreshBtn: { fontSize: 20, color: "#B0B0B0" },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  filterTabActive: {
    backgroundColor: "#D32F2F",
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B0B0B0",
  },
  filterTabTextActive: {
    color: "#FFF",
  },
  grid: {
    paddingBottom: 40,
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
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: "700", color: "#FFF", marginBottom: 4 },
  emptySubtext: { fontSize: 14, color: "#B0B0B0", marginBottom: 20 },
  createLink: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#D32F2F",
    borderRadius: 12,
  },
  createLinkText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
});
