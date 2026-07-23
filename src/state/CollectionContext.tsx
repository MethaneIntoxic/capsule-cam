// src/state/CollectionContext.tsx
// React Context for the capsule collection (persisted storage).

import React, { createContext, useContext } from "react";
import { Capsule } from "../models/Capsule";
import { useCollection } from "../hooks/useCollection";

interface CollectionContextValue {
  capsules: Capsule[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  addCapsule: (capsule: Capsule) => Promise<void>;
  updateCapsule: (capsule: Capsule) => Promise<void>;
  removeCapsule: (capsuleId: string) => Promise<void>;
  getCapsule: (id: string) => Promise<Capsule | null>;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const collection = useCollection();
  return (
    <CollectionContext.Provider value={collection}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollectionContext(): CollectionContextValue {
  const ctx = useContext(CollectionContext);
  if (!ctx) {
    throw new Error("useCollectionContext must be used within a CollectionProvider");
  }
  return ctx;
}
