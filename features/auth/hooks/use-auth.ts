"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { authLimiter } from "@/services/rate-limiter";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

export function useLogin(nextPath = "/orders") {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => {
      if (!authLimiter.canProceed("login")) {
        return Promise.reject({ message: "Too many login attempts. Please wait a minute before trying again." });
      }
      return authService.login(payload);
    },
    onSuccess: async (session) => {
      authLimiter.reset("login"); // Reset on success
      setSession(session);
      await queryClient.invalidateQueries();
      toast.success(`Welcome back, ${session.user.name}`);
      router.push(nextPath);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Login failed");
    }
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => {
      if (!authLimiter.canProceed("register")) {
        return Promise.reject({ message: "Too many registration attempts. Please wait a minute before trying again." });
      }
      return authService.register(payload);
    },
    onSuccess: async (session) => {
      authLimiter.reset("register");
      setSession(session);
      await queryClient.invalidateQueries();
      toast.success("Your account is ready");
      router.push("/orders");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Registration failed");
    }
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      clearSession();
      queryClient.clear();
      toast.success("Signed out");
      router.push("/");
    }
  });
}
