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
        const capsuleId = generateUUID();
        let finalImageUri = imageUri;
        let finalThumbUri = imageUri;

        try {
          const { fullUri, thumbnailUri } = await resizeImage(imageUri);
          finalImageUri = fullUri;
          finalThumbUri = thumbnailUri;

          if (FileSystemModule && FileSystemModule.documentDirectory) {
            const destDir = FileSystemModule.documentDirectory + "images/";
            const dirInfo = await FileSystemModule.getInfoAsync(destDir);
            if (!dirInfo?.exists) {
              await FileSystemModule.makeDirectoryAsync(destDir, { intermediates: true });
            }

            const destUri = destDir + `${capsuleId}.jpg`;
            await FileSystemModule.copyAsync({ from: fullUri, to: destUri });
            finalImageUri = destUri;

            const thumbDestUri = destDir + `${capsuleId}_thumb.jpg`;
            await FileSystemModule.copyAsync({ from: thumbnailUri, to: thumbDestUri });
            finalThumbUri = thumbDestUri;
          }
        } catch {
          // Fall back to original URI if filesystem unavailable
        }

        const { color, rarity } = randomCapsuleParams();
        const capsule = createCapsule({
          id: capsuleId,
          imageUri: finalImageUri,
          thumbnailUri: finalThumbUri,
          caption: caption ?? null,
          capsuleColor: color,
          rarity,
        });

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
