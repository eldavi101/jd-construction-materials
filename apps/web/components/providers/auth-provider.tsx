"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthSession,
  AuthUser,
  clearStoredSession,
  fetchMeWithAutoRefresh,
  getStoredSession,
  login,
  logout,
  register,
  storeSession,
} from "@/lib/auth-client";

type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  registerUser: (input: RegisterInput) => Promise<void>;
  loginUser: (input: LoginInput) => Promise<void>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      const session = getStoredSession();
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const freshUser = await fetchMeWithAutoRefresh();
        const latestSession = getStoredSession() ?? session;
        setUser(freshUser);
        setAccessToken(latestSession.accessToken);
        storeSession({ ...latestSession, user: freshUser });
      } catch {
        clearStoredSession();
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    void boot();
  }, []);

  const applySession = useCallback((session: AuthSession) => {
    setUser(session.user);
    setAccessToken(session.accessToken);
    storeSession(session);
  }, []);

  const registerUser = useCallback(
    async (input: RegisterInput) => {
      const session = await register(input);
      applySession(session);
    },
    [applySession],
  );

  const loginUser = useCallback(
    async (input: LoginInput) => {
      const session = await login(input);
      applySession(session);
    },
    [applySession],
  );

  const logoutUser = useCallback(async () => {
    const session = getStoredSession();

    if (session?.accessToken) {
      try {
        await logout(session.accessToken);
      } catch {
        // Clear local session even when API logout fails.
      }
    }

    clearStoredSession();
    setUser(null);
    setAccessToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      loading,
      isAuthenticated: !!user,
      registerUser,
      loginUser,
      logoutUser,
    }),
    [user, accessToken, loading, registerUser, loginUser, logoutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
