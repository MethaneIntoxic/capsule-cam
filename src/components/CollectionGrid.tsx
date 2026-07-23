// src/components/CollectionGrid.tsx
// 3-column grid layout for the collection shelf.

import React from "react";
import { TouchableOpacity } from "react-native";
import {
  FlatList,
  StyleSheet,
  Dimensions,
  type ListRenderItem,
} from "react-native";
import { Capsule } from "../models/Capsule";
import CapsuleThumbnail from "./CapsuleThumbnail";

const { width } = Dimensions.get("window");
const COLUMNS = 3;
const SPACING = 12;
const ITEM_SIZE = (width - 40 - SPACING * (COLUMNS - 1)) / COLUMNS;

interface CollectionGridProps {
  capsules: Capsule[];
  onSelect: (capsule: Capsule) => void;
  onDelete: (capsule: Capsule) => void;
}

export default function CollectionGrid({
  capsules,
  onSelect,
  onDelete,
}: CollectionGridProps) {
  const renderItem: ListRenderItem<Capsule> = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      onLongPress={() => onDelete(item)}
    >
      <CapsuleThumbnail capsule={item} size={ITEM_SIZE} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={capsules}
      keyExtractor={(item) => item.id}
      numColumns={COLUMNS}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingBottom: 40,
  },
  row: {
    gap: SPACING,
    marginBottom: SPACING,
  },
});
