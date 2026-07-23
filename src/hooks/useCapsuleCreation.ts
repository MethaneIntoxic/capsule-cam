// src/hooks/useCapsuleCreation.ts
// Orchestrates the full capsule creation pipeline: resize → randomise → persist.

import { useState, useCallback } from "react";
import { Capsule, createCapsule } from "../models/Capsule";
import { resizeImage } from "../utils/imageResizer";
import { randomCapsuleParams } from "../utils/randomiser";
import { capsuleRepository } from "../storage/capsuleRepository";
import { generateUUID } from "../utils/uuid";

// Lazy-require native-only module — unavailable on web
let FileSystemModule: typeof import("expo-file-system/legacy") | null = null;
try {
  FileSystemModule = require("expo-file-system/legacy");
} catch {
  // Native module not available (web)
}

interface UseCapsuleCreationResult {
  isCreating: boolean;
  error: string | null;
  create: (imageUri: string, caption?: string) => Promise<Capsule | null>;
}

export function useCapsuleCreation(): UseCapsuleCreationResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (imageUri: string, caption?: string): Promise<Capsule | null> => {
      setIsCreating(true);
      setError(null);
      try {
        // 1. Pre-generate ID for consistent filenames
        const capsuleId = generateUUID();

        // 2. Resize image for performance
        const { fullUri, thumbnailUri } = await resizeImage(imageUri);

        // 3. Copy resized image to app's document directory for persistence
        const destDir = (FileSystemModule?.documentDirectory ?? "") + "images/";
        const dirInfo = await FileSystemModule?.getInfoAsync(destDir);
        if (!dirInfo?.exists) {
          await FileSystemModule?.makeDirectoryAsync(destDir, { intermediates: true });
        }

        const filename = `${capsuleId}.jpg`;
        const destUri = destDir + filename;
        await FileSystemModule?.copyAsync({ from: fullUri, to: destUri });

        const thumbFilename = `${capsuleId}_thumb.jpg`;
        const thumbDestUri = destDir + thumbFilename;
        await FileSystemModule?.copyAsync({ from: thumbnailUri, to: thumbDestUri });

        // 4. Randomise capsule properties
        const { color, rarity } = randomCapsuleParams();

        // 5. Build capsule object with the pre-generated ID
        const capsule = createCapsule({
          id: capsuleId,
          imageUri: destUri,
          thumbnailUri: thumbDestUri,
          caption: caption ?? null,
          capsuleColor: color,
          rarity,
        });

        // 6. Save immediately
        await capsuleRepository.save(capsule);

        return capsule;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to create capsule";
        setError(msg);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  return { isCreating, error, create };
}
