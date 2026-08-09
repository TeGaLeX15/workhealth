"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

export type AccentKey =
  | "green"
  | "blue"
  | "purple"
  | "orange"
  | "red";

export const ACCENTS: Record<
  AccentKey,
  {
    label: string;
    primary: string;
    dark: string;
  }
> = {
  green: {
    label: "Зелёный",
    primary: "#22c55e",
    dark: "#16a34a",
  },
  blue: {
    label: "Синий",
    primary: "#3b82f6",
    dark: "#2563eb",
  },
  purple: {
    label: "Фиолетовый",
    primary: "#8b5cf6",
    dark: "#7c3aed",
  },
  orange: {
    label: "Оранжевый",
    primary: "#f97316",
    dark: "#ea580c",
  },
  red: {
    label: "Красный",
    primary: "#ef4444",
    dark: "#dc2626",
  },
};

const THEME_STORAGE_KEY = "bodyos-theme";
const ACCENT_STORAGE_KEY = "bodyos-accent";

const DEFAULT_THEME: ThemeMode = "system";
const DEFAULT_ACCENT: AccentKey = "green";

function isThemeMode(value: unknown): value is ThemeMode {
  return (
    value === "light" ||
    value === "dark" ||
    value === "system"
  );
}

function isAccentKey(value: unknown): value is AccentKey {
  return (
    value === "green" ||
    value === "blue" ||
    value === "purple" ||
    value === "orange" ||
    value === "red"
  );
}

/* -------------------------------------------------------------------------- */
/*                              Local storage                                 */
/* -------------------------------------------------------------------------- */

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const value = window.localStorage.getItem(
    THEME_STORAGE_KEY
  );

  return isThemeMode(value) ? value : DEFAULT_THEME;
}

function getStoredAccent(): AccentKey {
  if (typeof window === "undefined") {
    return DEFAULT_ACCENT;
  }

  const value = window.localStorage.getItem(
    ACCENT_STORAGE_KEY
  );

  return isAccentKey(value) ? value : DEFAULT_ACCENT;
}

/* -------------------------------------------------------------------------- */
/*                              Store listeners                               */
/* -------------------------------------------------------------------------- */

const listeners = new Set<() => void>();

function subscribeSettings(callback: () => void) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

function notifySettingsChanged() {
  listeners.forEach((listener) => listener());
}

function saveTheme(theme: ThemeMode) {
  window.localStorage.setItem(
    THEME_STORAGE_KEY,
    theme
  );

  notifySettingsChanged();
}

function saveAccent(accent: AccentKey) {
  window.localStorage.setItem(
    ACCENT_STORAGE_KEY,
    accent
  );

  notifySettingsChanged();
}

/* -------------------------------------------------------------------------- */
/*                              System theme                                  */
/* -------------------------------------------------------------------------- */

function subscribeSystemTheme(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const media = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  media.addEventListener("change", callback);

  return () => {
    media.removeEventListener("change", callback);
  };
}

function getSystemTheme() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
}

function getServerSystemTheme() {
  return false;
}

/* -------------------------------------------------------------------------- */
/*                                Context                                     */
/* -------------------------------------------------------------------------- */

type ThemeContextValue = {
  themeMode: ThemeMode;
  accentKey: AccentKey;

  dark: boolean;

  accent: string;
  accentDark: string;

  setThemeMode: (theme: ThemeMode) => void;
  setAccentKey: (accent: AccentKey) => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/*                              Theme provider                                */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const themeMode = useSyncExternalStore(
    subscribeSettings,
    getStoredTheme,
    () => DEFAULT_THEME
  );

  const accentKey = useSyncExternalStore(
    subscribeSettings,
    getStoredAccent,
    () => DEFAULT_ACCENT
  );

  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    getServerSystemTheme
  );

  const dark =
    themeMode === "dark" ||
    (themeMode === "system" && systemDark);

  const accentConfig =
    ACCENTS[accentKey] ?? ACCENTS.green;

  const setThemeMode = (theme: ThemeMode) => {
    saveTheme(theme);
  };

  const setAccentKey = (accent: AccentKey) => {
    saveAccent(accent);
  };

  /*
   * Синхронизируем тему с <html> и глобальными CSS-переменными.
   *
   * Это единственный effect здесь, и он не меняет React state.
   * Он синхронизирует React-состояние с DOM — именно для этого
   * useEffect и предназначен.
   */
useEffect(() => {
  const root = document.documentElement;

  root.classList.toggle("dark", dark);

  root.style.setProperty(
    "--accent",
    accentConfig.primary,
  );

  root.style.setProperty(
    "--accent-dark",
    accentConfig.dark,
  );

  root.style.setProperty(
    "--background",
    dark ? "#09090b" : "#ffffff",
  );

  root.style.setProperty(
    "--foreground",
    dark ? "#fafafa" : "#18181b",
  );

  root.style.setProperty(
    "--card",
    dark ? "#18181b" : "#ffffff",
  );

  root.style.setProperty(
    "--surface",
    dark ? "#27272a" : "#f4f4f5",
  );

  root.style.setProperty(
    "--muted",
    dark ? "#a1a1aa" : "#71717a",
  );

  root.style.setProperty(
    "--subtle",
    dark ? "#71717a" : "#a1a1aa",
  );

  root.style.setProperty(
    "--border",
    dark ? "#27272a" : "#e4e4e7",
  );

  root.style.setProperty(
    "--divider",
    dark ? "#27272a" : "#f4f4f5",
  );

  root.style.colorScheme = dark ? "dark" : "light";
}, [dark, accentConfig]);

  const value: ThemeContextValue = {
    themeMode,
    accentKey,

    dark,

    accent: accentConfig.primary,
    accentDark: accentConfig.dark,

    setThemeMode,
    setAccentKey,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Hook                                      */
/* -------------------------------------------------------------------------- */

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
