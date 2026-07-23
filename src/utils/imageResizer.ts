// src/utils/imageResizer.ts
// Resize images after selection to ensure performant rendering.

import * as ImageManipulator from "expo-image-manipulator";

export interface ResizedImages {
  fullUri: string;
  thumbnailUri: string;
}

/**
 * Resize an image to max 1024×1024 for storage (full) and 256×256 for thumbnails.
 */
export async function resizeImage(uri: string): Promise<ResizedImages> {
  const full = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024, height: 1024 } }],
    { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
  );

  const thumb = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 256, height: 256 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  return { fullUri: full.uri, thumbnailUri: thumb.uri };
}
