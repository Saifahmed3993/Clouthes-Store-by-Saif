"use client";

import { create } from "zustand";

type UiState = {
  isMiniCartOpen: boolean;
  setMiniCartOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isMiniCartOpen: false,
  setMiniCartOpen: (open) => set({ isMiniCartOpen: open })
}));
