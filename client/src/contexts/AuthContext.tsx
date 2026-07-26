import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loginUser } from "@/api/auth";
import type { Role, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  login: (
    username: string,
    password: string,
    role: Role,
    remember: boolean
  ) => Promise<User>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "imd_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login(username, password, role, remember) {
        try {
          const data = await loginUser(username, password, role);

          const safeUser: User = data.user;

          setUser(safeUser);

          const storage = remember ? localStorage : sessionStorage;

          storage.setItem(STORAGE_KEY, JSON.stringify(safeUser));

          storage.setItem("access_token", data.access_token);

          return safeUser;
        } catch (error) {
          throw new Error("Invalid username or password");
        }
      },
      logout() {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");

      },
      hasRole(...roles) {
        return !!user && roles.includes(user.role);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
