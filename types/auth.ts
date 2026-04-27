export type UserRole = "customer" | "admin";

// Matches backend UserProfileResponse DTO (GET /v1/auth/me)
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  /** Computed helper for display — firstName + " " + lastName */
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string | null;
  isEmailVerified?: boolean;
  avatarUrl?: string;
};

// Matches backend LoginRequest DTO
export type LoginPayload = {
  email: string;
  password: string;
};

// Matches backend RegisterRequest DTO
export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
};

// Matches backend AuthResponse DTO
export type AuthResponse = {
  // Access token — kept in memory only, never persisted
  accessToken: string;
  // User profile embedded in auth response
  user: User;
  // Refresh token is returned here; backend also sets it as HttpOnly cookie
  refreshToken?: string;
  expiresAt?: string;
};

// Raw backend response shape (before mapping to User)
export type BackendAuthResponse = {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

// Raw backend /me response shape
export type BackendUserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
};
