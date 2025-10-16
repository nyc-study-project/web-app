import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { makeClients, publicClients } from "../api";
import type { UserRead } from "../generated/users/models/UserRead";

interface AuthContextType {
  user: UserRead | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  signup: (data: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserRead | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        setIsLoading(true);
        try {
          const clients = makeClients(token);
          const userData = await clients.userApi.getCurrentUserAuthMeGet();
          if (userData?.id) {
            setUser(userData);
          } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
          }
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    void fetchUser();
  }, [token]);

  const login = useCallback(async (formData: Record<string, any>) => {
    try {
      // Generated method expects a plain body object
      const payload = await publicClients.userApi.loginUserAuthLoginPost(formData);

      const newToken =
        payload.session_token || payload.access_token || payload.token || null;

      if (newToken) {
        setToken(newToken);
        localStorage.setItem("token", newToken);
        return { success: true };
      }
      return { success: false, error: "No token returned from login." };
    } catch (err: any) {
      return { success: false, error: err?.message || "Login failed." };
    }
  }, []);

  const signup = useCallback(async (formData: Record<string, any>) => {
    try {
      // Generated method expects a plain body object (not { requestBody })
      await publicClients.userApi.registerUserAuthRegisterPost(formData);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Signup failed." };
    }
  }, []);

  const logout = useCallback(async () => {
    const currentToken = token || localStorage.getItem("token");
    if (currentToken) {
      try {
        await publicClients.userApi.logoutUserAuthLogoutPost({
          session_token: currentToken,
        });
      } catch {
        /* ignore backend logout errors */
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user && !!token,
      login,
      signup,
      logout,
    }),
    [user, token, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
