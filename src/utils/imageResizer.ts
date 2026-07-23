// src/utils/imageResizer.ts
// Resize images after selection for performant rendering.

import * as ImageManipulator from "expo-image-manipulator";

export interface ResizedImages {
  fullUri: string;
  thumbnailUri: string;
}

/**
 * Resize image safely. Returns original URI on web/http/error.
 */
export async function resizeImage(uri: string): Promise<ResizedImages> {
  if (!uri || uri.startsWith("http") || uri.startsWith("data:")) {
    return { fullUri: uri, thumbnailUri: uri };
  }

  try {
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
  } catch {
    return { fullUri: uri, thumbnailUri: uri };
  }
}

