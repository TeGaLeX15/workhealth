// app/providers/theme-provider.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

export type AccentKey =
  | "green"
  | "blue"
  | "purple"
  | "orange"
  | "red"
  | "teal"
  | "pink"
  | "indigo"
  | "amber"
  | "cyan";

type AccentConfig = {
  label: string;
  primary: string;
  dark: string;
  softLight: string;
  softDark: string;
  contrast: string;
};

export const ACCENTS: Record<AccentKey, AccentConfig> = {
  green: {
    label: "Зелёный",
    primary: "#22c55e",
    dark: "#16a34a",
    softLight: "#dcfce7",
    softDark: "#14532d",
    contrast: "#ffffff",
  },

  blue: {
    label: "Синий",
    primary: "#3b82f6",
    dark: "#2563eb",
    softLight: "#dbeafe",
    softDark: "#1e3a8a",
    contrast: "#ffffff",
  },

  purple: {
    label: "Фиолетовый",
    primary: "#8b5cf6",
    dark: "#7c3aed",
    softLight: "#ede9fe",
    softDark: "#4c1d95",
    contrast: "#ffffff",
  },

  orange: {
    label: "Оранжевый",
    primary: "#f97316",
    dark: "#ea580c",
    softLight: "#ffedd5",
    softDark: "#7c2d12",
    contrast: "#ffffff",
  },

  red: {
    label: "Красный",
    primary: "#ef4444",
    dark: "#dc2626",
    softLight: "#fee2e2",
    softDark: "#7f1d1d",
    contrast: "#ffffff",
  },

  teal: {
    label: "Бирюзовый",
    primary: "#14b8a6",
    dark: "#0d9488",
    softLight: "#ccfbf1",
    softDark: "#134e4a",
    contrast: "#ffffff",
  },

  pink: {
    label: "Розовый",
    primary: "#ec4899",
    dark: "#db2777",
    softLight: "#fce7f3",
    softDark: "#831843",
    contrast: "#ffffff",
  },

  indigo: {
    label: "Индиго",
    primary: "#6366f1",
    dark: "#4f46e5",
    softLight: "#e0e7ff",
    softDark: "#312e81",
    contrast: "#ffffff",
  },

  amber: {
    label: "Янтарный",
    primary: "#f59e0b",
    dark: "#d97706",
    softLight: "#fef3c7",
    softDark: "#78350f",
    contrast: "#ffffff",
  },

  cyan: {
    label: "Циан",
    primary: "#06b6d4",
    dark: "#0891b2",
    softLight: "#cffafe",
    softDark: "#164e63",
    contrast: "#ffffff",
  },
};

const THEME_STORAGE_KEY = "bodyos-theme";
const ACCENT_STORAGE_KEY = "bodyos-accent";

const DEFAULT_THEME: ThemeMode = "system";
const DEFAULT_ACCENT: AccentKey = "green";

/**
 * Проверяет, является ли значение допустимым режимом темы.
 *
 * @param value Значение для проверки.
 * @returns `true`, если значение является допустимым режимом темы.
 */
function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Проверяет, является ли значение допустимым ключом акцентного цвета.
 *
 * @param value Значение для проверки.
 * @returns `true`, если значение является допустимым ключом акцента.
 */
function isAccentKey(value: unknown): value is AccentKey {
  return (
    value === "green" ||
    value === "blue" ||
    value === "purple" ||
    value === "orange" ||
    value === "red" ||
    value === "teal" ||
    value === "pink" ||
    value === "indigo" ||
    value === "amber" ||
    value === "cyan"
  );
}

/**
 * Получает сохранённый режим темы из localStorage.
 *
 * @returns Сохранённый режим темы или значение по умолчанию.
 */
function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);

    return isThemeMode(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/**
 * Получает сохранённый акцентный цвет из localStorage.
 *
 * @returns Сохранённый акцент или значение по умолчанию.
 */
function getStoredAccent(): AccentKey {
  if (typeof window === "undefined") {
    return DEFAULT_ACCENT;
  }

  try {
    const value = window.localStorage.getItem(ACCENT_STORAGE_KEY);

    return isAccentKey(value) ? value : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

const listeners = new Set<() => void>();

/**
 * Подписывает компонент на изменения настроек темы.
 *
 * @param callback Функция, вызываемая при изменении настроек.
 * @returns Функция для отмены подписки.
 */
function subscribeSettings(callback: () => void) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

/**
 * Уведомляет подписчиков об изменении настроек темы.
 */
function notifySettingsChanged() {
  listeners.forEach((listener) => listener());
}

/**
 * Сохраняет режим темы в localStorage и уведомляет подписчиков.
 *
 * @param theme Новый режим темы.
 */
function saveTheme(theme: ThemeMode) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ошибки localStorage не должны прерывать работу приложения.
  }

  notifySettingsChanged();
}

/**
 * Сохраняет акцентный цвет в localStorage и уведомляет подписчиков.
 *
 * @param accent Новый акцентный цвет.
 */
function saveAccent(accent: AccentKey) {
  try {
    window.localStorage.setItem(ACCENT_STORAGE_KEY, accent);
  } catch {
    // Ошибки localStorage не должны прерывать работу приложения.
  }

  notifySettingsChanged();
}

/**
 * Подписывает компонент на изменения системной темы.
 *
 * @param callback Функция, вызываемая при изменении системной темы.
 * @returns Функция для отмены подписки.
 */
function subscribeSystemTheme(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  media.addEventListener("change", callback);

  return () => {
    media.removeEventListener("change", callback);
  };
}

/**
 * Определяет, используется ли тёмная системная тема.
 *
 * @returns `true`, если система использует тёмную тему.
 */
function getSystemTheme() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Возвращает значение системной темы для серверного рендера.
 *
 * @returns `false`, так как сервер не имеет доступа к системным настройкам.
 */
function getServerSystemTheme() {
  return false;
}

type ThemeContextValue = {
  themeMode: ThemeMode;
  accentKey: AccentKey;

  dark: boolean;

  accent: string;
  accentDark: string;
  accentSoft: string;
  accentContrast: string;

  setThemeMode: (theme: ThemeMode) => void;
  setAccentKey: (accent: AccentKey) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Провайдер настроек темы и акцентного цвета приложения.
 *
 * Хранит настройки в localStorage, отслеживает системную тему
 * и синхронизирует выбранные значения с CSS-переменными документа.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeMode = useSyncExternalStore(
    subscribeSettings,
    getStoredTheme,
    () => DEFAULT_THEME,
  );

  const accentKey = useSyncExternalStore(
    subscribeSettings,
    getStoredAccent,
    () => DEFAULT_ACCENT,
  );

  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  );

  const dark = themeMode === "dark" || (themeMode === "system" && systemDark);

  const accentConfig = ACCENTS[accentKey] ?? ACCENTS.green;

  const setThemeMode = useCallback((theme: ThemeMode) => {
    saveTheme(theme);
  }, []);

  const setAccentKey = useCallback((accent: AccentKey) => {
    saveAccent(accent);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const background = dark ? "#09090b" : "#ffffff";
    const foreground = dark ? "#fafafa" : "#18181b";

    root.classList.toggle("dark", dark);

    root.style.setProperty("--accent", accentConfig.primary);
    root.style.setProperty("--accent-dark", accentConfig.dark);
    root.style.setProperty(
      "--accent-soft",
      dark ? accentConfig.softDark : accentConfig.softLight,
    );
    root.style.setProperty("--accent-contrast", accentConfig.contrast);

    root.style.setProperty("--background", background);
    root.style.setProperty("--foreground", foreground);

    root.style.setProperty("--card", dark ? "#18181b" : "#ffffff");
    root.style.setProperty("--surface", dark ? "#27272a" : "#f4f4f5");
    root.style.setProperty("--muted", dark ? "#a1a1aa" : "#71717a");
    root.style.setProperty("--subtle", dark ? "#71717a" : "#a1a1aa");
    root.style.setProperty("--border", dark ? "#27272a" : "#e4e4e7");
    root.style.setProperty("--divider", dark ? "#27272a" : "#f4f4f5");

    root.style.colorScheme = dark ? "dark" : "light";

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.setAttribute("content", background);
  }, [dark, accentConfig]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      accentKey,

      dark,

      accent: accentConfig.primary,
      accentDark: accentConfig.dark,
      accentSoft: dark ? accentConfig.softDark : accentConfig.softLight,
      accentContrast: accentConfig.contrast,

      setThemeMode,
      setAccentKey,
    }),
    [themeMode, accentKey, dark, accentConfig, setThemeMode, setAccentKey],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Возвращает настройки темы текущего приложения.
 *
 * @returns Значения и методы управления темой.
 * @throws Ошибку, если хук используется вне `ThemeProvider`.
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
