// src/hooks/useCapsuleMachine.ts
// useReducer-based state machine for the gashapon animation flow.

import { useReducer, useCallback } from "react";
import { Capsule } from "../models/Capsule";

export type MachinePhase =
  | "idle"
  | "ready"
  | "turning"
  | "activated"
  | "shaking"
  | "dispensing"
  | "dropping"
  | "landed"
  | "opening"
  | "revealed"
  | "completed";

export interface MachineState {
  phase: MachinePhase;
  currentCapsule: Capsule | null;
  handleRotation: number;
  error: string | null;
}

type MachineAction =
  | { type: "LOAD_IMAGE" }
  | { type: "START_TURNING" }
  | { type: "SET_ROTATION"; rotation: number }
  | { type: "ACTIVATE"; capsule: Capsule }
  | { type: "SHAKE_COMPLETE" }
  | { type: "DISPENSE_COMPLETE" }
  | { type: "DROP_COMPLETE" }
  | { type: "START_OPENING" }
  | { type: "OPEN_COMPLETE" }
  | { type: "SAVE_COMPLETE" }
  | { type: "RESET" }
  | { type: "ERROR"; error: string };

const initialState: MachineState = {
  phase: "idle",
  currentCapsule: null,
  handleRotation: 0,
  error: null,
};

function machineReducer(state: MachineState, action: MachineAction): MachineState {
  switch (state.phase) {
    case "idle":
      if (action.type === "LOAD_IMAGE") return { ...state, phase: "ready" };
      return state;

    case "ready":
      if (action.type === "START_TURNING") return { ...state, phase: "turning" };
      return state;

    case "turning":
      if (action.type === "SET_ROTATION") {
        return { ...state, handleRotation: action.rotation };
      }
      if (action.type === "ACTIVATE") {
        return {
          ...state,
          phase: "shaking",
          currentCapsule: action.capsule,
        };
      }
      return state;

    case "shaking":
      if (action.type === "SHAKE_COMPLETE")
        return { ...state, phase: "dispensing" };
      return state;

    case "dispensing":
      if (action.type === "DISPENSE_COMPLETE")
        return { ...state, phase: "dropping" };
      return state;

    case "dropping":
      if (action.type === "DROP_COMPLETE")
        return { ...state, phase: "landed" };
      return state;

    case "landed":
      if (action.type === "START_OPENING")
        return { ...state, phase: "opening" };
      return state;

    case "opening":
      if (action.type === "OPEN_COMPLETE")
        return { ...state, phase: "revealed" };
      return state;

    case "revealed":
      if (action.type === "SAVE_COMPLETE")
        return { ...state, phase: "completed" };
      return state;

    case "completed":
      if (action.type === "RESET") return { ...initialState };
      return state;

    default:
      return state;
  }
}

export function useCapsuleMachine() {
  const [state, dispatch] = useReducer(machineReducer, initialState);

  const loadImage = useCallback(() => dispatch({ type: "LOAD_IMAGE" }), []);
  const startTurning = useCallback(() => dispatch({ type: "START_TURNING" }), []);
  const setRotation = useCallback(
    (rotation: number) => dispatch({ type: "SET_ROTATION", rotation }),
    []
  );
  const activate = useCallback(
    (capsule: Capsule) => dispatch({ type: "ACTIVATE", capsule }),
    []
  );
  const shakeComplete = useCallback(
    () => dispatch({ type: "SHAKE_COMPLETE" }),
    []
  );
  const dispenseComplete = useCallback(
    () => dispatch({ type: "DISPENSE_COMPLETE" }),
    []
  );
  const dropComplete = useCallback(
    () => dispatch({ type: "DROP_COMPLETE" }),
    []
  );
  const startOpening = useCallback(
    () => dispatch({ type: "START_OPENING" }),
    []
  );
  const openComplete = useCallback(
    () => dispatch({ type: "OPEN_COMPLETE" }),
    []
  );
  const saveComplete = useCallback(
    () => dispatch({ type: "SAVE_COMPLETE" }),
    []
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return {
    state,
    dispatch,
    actions: {
      loadImage,
      startTurning,
      setRotation,
      activate,
      shakeComplete,
      dispenseComplete,
      dropComplete,
      startOpening,
      openComplete,
      saveComplete,
      reset,
    },
  };
}
