// src/state/MachineContext.tsx
// React Context for the gashapon machine animation state.

import React, { createContext, useContext } from "react";
import {
  MachineState,
  MachinePhase,
  useCapsuleMachine,
} from "../hooks/useCapsuleMachine";

interface MachineContextValue {
  state: MachineState;
  actions: ReturnType<typeof useCapsuleMachine>["actions"];
}

const MachineContext = createContext<MachineContextValue | null>(null);

export function MachineProvider({ children }: { children: React.ReactNode }) {
  const { state, actions } = useCapsuleMachine();
  return (
    <MachineContext.Provider value={{ state, actions }}>
      {children}
    </MachineContext.Provider>
  );
}

export function useMachineContext(): MachineContextValue {
  const ctx = useContext(MachineContext);
  if (!ctx) {
    throw new Error("useMachineContext must be used within a MachineProvider");
  }
  return ctx;
}
