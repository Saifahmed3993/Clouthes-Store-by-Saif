let accessToken: string | null = null;
const listeners = new Set<(token: string | null) => void>();

export const tokenManager = {
  getAccessToken() {
    return accessToken;
  },
  setAccessToken(token: string | null) {
    accessToken = token;
    listeners.forEach((listener) => listener(token));
  },
  clear() {
    accessToken = null;
    listeners.forEach((listener) => listener(null));
  },
  subscribe(listener: (token: string | null) => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
