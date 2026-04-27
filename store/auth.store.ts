"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { tokenManager } from "@/services/token-manager";
import type { User } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
  setSession: (session: { user: User; accessToken: string }) => void;
  setUser: (user: User | null) => void;
  clearSession: () => void;
  setStatus: (status: AuthStatus) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      status: "anonymous",
      setSession: ({ user, accessToken }) => {
        tokenManager.setAccessToken(accessToken);
        set({ user, accessToken, status: "authenticated" });
      },
      setUser: (user) => set({ user, status: user ? "authenticated" : "anonymous" }),
      clearSession: () => {
        tokenManager.clear();
        set({ user: null, accessToken: null, status: "anonymous" });
      },
      setStatus: (status) => set({ status })
    }),
    {
      name: "clouthes-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        status: state.user ? "authenticated" : "anonymous",
        accessToken: null
      })
    }
  )
);
