import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loginUser } from "@/api/auth";
import type { Role, User } from "@/types";
import { clearAuth } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getToken, getTokenExpiry, isTokenExpired } from "@/utils/session";

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
  const navigate = useNavigate();
  const logoutTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {

    function handleSessionExpired() {

      setUser(null);

      clearAuth();

      toast.error("Your session has expired. Please login again.");

      navigate("/login", {
        replace: true,
      });

    }

    window.addEventListener(
      "session-expired",
      handleSessionExpired
    );

    return () =>
      window.removeEventListener(
        "session-expired",
        handleSessionExpired
      );

  }, [navigate]);
  useEffect(() => {
    const token = getToken();

    if (!token) return;

    if (isTokenExpired(token)) {
      setUser(null);
      clearAuth();

      navigate("/login", {
        replace: true,
      });

      return;
    }

    const expiry = getTokenExpiry(token);

    if (!expiry) return;

    const remaining = expiry - Date.now();

    logoutTimer.current = window.setTimeout(() => {

      setUser(null);

      clearAuth();

      toast.error("Your session has expired. Please login again.");

      navigate("/login", {
        replace: true,
      });

    }, remaining);

    return () => {

      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }

    };

  }, [user, navigate]);
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

        if (logoutTimer.current) {
          clearTimeout(logoutTimer.current);
        }

        setUser(null);

        clearAuth();

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
