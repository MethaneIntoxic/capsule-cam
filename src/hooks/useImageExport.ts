// src/hooks/useImageExport.ts
// Placeholder for Phase 4 — image/video export for sharing.

import { useCallback } from "react";
import { Capsule } from "../models/Capsule";

export function useImageExport() {
  const exportAsImage = useCallback(
    async (_capsule: Capsule): Promise<string | null> => {
      // TODO: Phase 4 — render export layout and return file URI
      return null;
    },
    []
  );

  const shareExport = useCallback(async (_fileUri: string): Promise<void> => {
    // TODO: Phase 4 — trigger native share sheet
  }, []);

  return { exportAsImage, shareExport };
}
