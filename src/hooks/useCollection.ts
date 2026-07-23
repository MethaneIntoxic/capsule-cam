// src/hooks/useCollection.ts
// Hook wrapping capsuleRepository for use in React components.
// Supports upsert (add or update by id).

import { useState, useEffect, useCallback } from "react";
import { Capsule } from "../models/Capsule";
import { capsuleRepository } from "../storage/capsuleRepository";

export function useCollection() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const all = await capsuleRepository.getAll();
    setCapsules(all);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Upsert: add if new, update if existing
  const addCapsule = useCallback(
    async (capsule: Capsule) => {
      await capsuleRepository.save(capsule);
      setCapsules((prev) => {
        const idx = prev.findIndex((c) => c.id === capsule.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = capsule;
          return updated;
        }
        return [capsule, ...prev];
      });
    },
    []
  );

  // Alias for semantic clarity
  const updateCapsule = addCapsule;

  const removeCapsule = useCallback(
    async (capsuleId: string) => {
      await capsuleRepository.delete(capsuleId);
      setCapsules((prev) => prev.filter((c) => c.id !== capsuleId));
    },
    []
  );

  const getCapsule = useCallback(
    async (id: string): Promise<Capsule | null> => {
      const inMemory = capsules.find((c) => c.id === id);
      if (inMemory) return inMemory;
      return capsuleRepository.getById(id);
    },
    [capsules]
  );

  return {
    capsules,
    isLoading,
    refresh,
    addCapsule,
    updateCapsule,
    removeCapsule,
    getCapsule,
  };
}
