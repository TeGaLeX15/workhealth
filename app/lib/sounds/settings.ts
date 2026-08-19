// app/lib/sounds/settings.ts

/**
 * Настройки звуковых уведомлений приложения.
 */
export type SoundSettings = {
  /** Включены ли звуки в приложении. */
  enabled: boolean;

  /** Звук обратного отсчёта времени отдыха. */
  restCountdown: boolean;

  /** Звук окончания времени отдыха. */
  restComplete: boolean;

  /** Звук завершения тренировки. */
  workoutComplete: boolean;

  /** Звук установления нового максимума. */
  newMax: boolean;
};

/**
 * Настройки звука по умолчанию.
 */
export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  enabled: true,

  restCountdown: true,
  restComplete: true,

  workoutComplete: true,
  newMax: true,
};

const STORAGE_KEY = "bodyos_sound_settings";

let cachedSettings: SoundSettings = DEFAULT_SOUND_SETTINGS;

let initialized = false;

const listeners = new Set<() => void>();

/**
 * Проверяет, соответствует ли значение структуре настроек звука.
 *
 * @param value Значение для проверки.
 * @returns true, если значение является корректными настройками звука.
 */
function isSoundSettings(value: unknown): value is SoundSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.enabled === "boolean" &&
    typeof settings.restCountdown === "boolean" &&
    typeof settings.restComplete === "boolean" &&
    typeof settings.workoutComplete === "boolean" &&
    typeof settings.newMax === "boolean"
  );
}

/**
 * Загружает настройки звука из localStorage
 * и инициализирует локальный кэш.
 */
function initializeSettings() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    const parsed: unknown = JSON.parse(stored);

    if (isSoundSettings(parsed)) {
      cachedSettings = parsed;
    }
  } catch {
    cachedSettings = DEFAULT_SOUND_SETTINGS;
  }
}

/**
 * Возвращает текущие настройки звука.
 *
 * При первом вызове настройки загружаются
 * из localStorage в браузере.
 */
export function getSoundSettings(): SoundSettings {
  initializeSettings();

  return cachedSettings;
}

/**
 * Возвращает настройки звука,
 * используемые во время серверного рендера.
 *
 * На сервере всегда используются настройки по умолчанию,
 * поскольку localStorage недоступен.
 */
export function getServerSoundSettings(): SoundSettings {
  return DEFAULT_SOUND_SETTINGS;
}

/**
 * Обновляет настройки звука, сохраняет их в localStorage
 * и уведомляет подписанные компоненты об изменении.
 *
 * @param update Новые значения настроек
 * или функция, вычисляющая их на основе текущих.
 */
export function updateSoundSettings(
  update: Partial<SoundSettings> | ((current: SoundSettings) => SoundSettings),
) {
  initializeSettings();

  const nextSettings =
    typeof update === "function"
      ? update(cachedSettings)
      : {
          ...cachedSettings,
          ...update,
        };

  cachedSettings = nextSettings;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
    } catch {
      // Сохраняем состояние в памяти,
      // если localStorage недоступен.
    }
  }

  listeners.forEach((listener) => {
    listener();
  });
}

/**
 * Подписывает слушатель на изменения настроек звука.
 *
 * Отслеживает как изменения внутри текущей вкладки,
 * так и изменения localStorage из других вкладок.
 *
 * @param listener Функция, вызываемая при изменении настроек.
 * @returns Функция для отмены подписки.
 */
export function subscribeToSoundSettings(listener: () => void) {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    initialized = false;
    initializeSettings();

    listener();
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(listener);

    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}
