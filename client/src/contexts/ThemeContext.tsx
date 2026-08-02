import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getTheme, updateTheme as saveTheme } from "@/api/theme";

export interface ThemeConfig {
  mode: "light" | "dark";
  primaryHue: number;
  radius: number;
  sidebarStyle: "solid" | "floating";
  cardStyle: "flat" | "elevated";
  animationSpeed: number;
  fontScale: number;
  compact: boolean;
}

const DEFAULT: ThemeConfig = {
  mode: "light",
  primaryHue: 255,
  radius: 12,
  sidebarStyle: "solid",
  cardStyle: "elevated",
  animationSpeed: 1,
  fontScale: 1,
  compact: false,
};

const STORAGE_KEY = "imd_theme_config";

interface ThemeContextValue {
  config: ThemeConfig;
  update: (patch: Partial<ThemeConfig>) => void;
  reset: () => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(cfg: ThemeConfig) {
  const root = document.documentElement;

  root.classList.toggle("dark", cfg.mode === "dark");

  root.style.setProperty("--radius", `${cfg.radius / 16}rem`);

  root.style.setProperty(
    "--primary",
    `oklch(0.36 0.14 ${cfg.primaryHue})`
  );

  root.style.setProperty(
    "--primary-500",
    `oklch(0.55 0.16 ${cfg.primaryHue})`
  );

  root.style.setProperty(
    "--primary-700",
    `oklch(0.42 0.15 ${cfg.primaryHue})`
  );

  root.style.setProperty(
    "--primary-900",
    `oklch(0.28 0.12 ${cfg.primaryHue})`
  );

  root.style.setProperty(
    "--ring",
    `oklch(0.36 0.14 ${cfg.primaryHue})`
  );

  root.style.setProperty(
    "--sidebar-primary",
    `oklch(0.36 0.14 ${cfg.primaryHue})`
  );

  root.style.fontSize = `${16 * cfg.fontScale}px`;

  root.dataset.sidebarStyle = cfg.sidebarStyle;
  root.dataset.cardStyle = cfg.cardStyle;
  root.dataset.compact = String(cfg.compact);

  root.style.setProperty(
    "--motion-scale",
    String(1 / cfg.animationSpeed)
  );
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT);

  // ==========================
  // Load Theme
  // ==========================
  useEffect(() => {
    async function loadTheme() {
      try {
        const theme = await getTheme();

        setConfig({
          ...DEFAULT,
          ...theme,
        });

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(theme)
        );
      } catch (error) {
        console.error("Failed to load theme from backend.", error);

        try {
          const raw = localStorage.getItem(STORAGE_KEY);

          if (raw) {
            setConfig({
              ...DEFAULT,
              ...JSON.parse(raw),
            });
          }
        } catch {
          setConfig(DEFAULT);
        }
      }
    }

    loadTheme();
  }, []);

  // ==========================
  // Apply Theme
  // ==========================
  useEffect(() => {
    applyTheme(config);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(config)
    );
  }, [config]);

  // ==========================
  // Save Theme (Debounced)
  // ==========================
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await saveTheme(config);
      } catch (error) {
        console.error("Failed to save theme.", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [config]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      config,

      update: (patch) =>
        setConfig((current) => ({
          ...current,
          ...patch,
        })),

      reset: () => setConfig(DEFAULT),

      toggleMode: () =>
        setConfig((current) => ({
          ...current,
          mode:
            current.mode === "light"
              ? "dark"
              : "light",
        })),
    }),
    [config]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }

  return ctx;
}