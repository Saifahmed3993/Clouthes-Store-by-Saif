import { apiClient } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import { tokenManager } from "@/services/token-manager";
import type { AuthResponse, BackendAuthResponse, BackendUserProfile, LoginPayload, RegisterPayload, User, UserRole } from "@/types/auth";

function mapAuthResponse(data: BackendAuthResponse): AuthResponse {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: data.expiresAt,
    user: {
      id: data.userId,
      firstName: "", 
      lastName: "",
      name: data.fullName,
      email: data.email,
      role: data.role.toLowerCase() as UserRole
    }
  };
}

function mapUserProfile(data: BackendUserProfile): User {
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    role: data.role.toLowerCase() as UserRole,
    phoneNumber: data.phoneNumber,
    isEmailVerified: data.isEmailVerified
  };
}

async function setSessionCookie(refreshToken: string) {
  try {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });
  } catch (error) {
    console.error("Failed to set session cookie", error);
  }
}

async function clearSessionCookie() {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } catch (error) {
    console.error("Failed to clear session cookie", error);
  }
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<BackendAuthResponse>(endpoints.auth.login, payload);
    const data = response.data;
    await setSessionCookie(data.refreshToken);
    tokenManager.setAccessToken(data.accessToken);
    return mapAuthResponse(data);
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<BackendAuthResponse>(endpoints.auth.register, payload);
    const data = response.data;
    await setSessionCookie(data.refreshToken);
    tokenManager.setAccessToken(data.accessToken);
    return mapAuthResponse(data);
  },

  async me(): Promise<User> {
    const response = await apiClient.get<BackendUserProfile>(endpoints.auth.me);
    return mapUserProfile(response.data);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(endpoints.auth.logout);
    } catch {
      // Ignore errors on logout
    } finally {
      await clearSessionCookie();
      tokenManager.clear();
    }
  }
};
