// app/lib/notifications/settings.ts

/**
 * Настройки уведомлений приложения.
 */
export type NotificationSettings = {
  /** Включены ли уведомления в приложении. */
  enabled: boolean;

  /** Напоминания о предстоящей тренировке. */
  workoutReminder: boolean;

  /** Уведомления о пропущенной тренировке. */
  missedWorkout: boolean;

  /** Уведомления о следующем подходе. */
  nextSet: boolean;

  /** Уведомления об установлении нового максимума. */
  newMax: boolean;

  /** Уведомления о достижении цели. */
  goalReached: boolean;

  /** Еженедельный отчёт о тренировках. */
  weeklyReport: boolean;
};

/**
 * Настройки уведомлений по умолчанию.
 */
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,

  workoutReminder: true,
  missedWorkout: true,

  nextSet: false,

  newMax: true,
  goalReached: true,

  weeklyReport: true,
};

const STORAGE_KEY = "bodyos_notification_settings";

let cachedSettings: NotificationSettings = DEFAULT_NOTIFICATION_SETTINGS;

let initialized = false;

const listeners = new Set<() => void>();

/**
 * Проверяет, соответствует ли значение структуре
 * настроек уведомлений.
 *
 * @param value Значение для проверки.
 * @returns true, если значение является корректными
 * настройками уведомлений.
 */
function isNotificationSettings(value: unknown): value is NotificationSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.enabled === "boolean" &&
    typeof settings.workoutReminder === "boolean" &&
    typeof settings.missedWorkout === "boolean" &&
    typeof settings.nextSet === "boolean" &&
    typeof settings.newMax === "boolean" &&
    typeof settings.goalReached === "boolean" &&
    typeof settings.weeklyReport === "boolean"
  );
}

/**
 * Загружает настройки уведомлений из localStorage
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

    if (isNotificationSettings(parsed)) {
      cachedSettings = parsed;
    }
  } catch {
    cachedSettings = DEFAULT_NOTIFICATION_SETTINGS;
  }
}

/**
 * Возвращает текущие настройки уведомлений.
 *
 * При первом вызове настройки загружаются
 * из localStorage в браузере.
 */
export function getNotificationSettings(): NotificationSettings {
  initializeSettings();

  return cachedSettings;
}

/**
 * Возвращает настройки уведомлений,
 * используемые во время серверного рендера.
 *
 * На сервере всегда используются настройки по умолчанию,
 * поскольку localStorage недоступен.
 */
export function getServerNotificationSettings(): NotificationSettings {
  return DEFAULT_NOTIFICATION_SETTINGS;
}

/**
 * Обновляет настройки уведомлений, сохраняет их в localStorage
 * и уведомляет подписанные компоненты об изменении.
 *
 * @param update Новые значения настроек
 * или функция, вычисляющая их на основе текущих.
 */
export function updateNotificationSettings(
  update:
    | Partial<NotificationSettings>
    | ((current: NotificationSettings) => NotificationSettings),
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
 * Подписывает слушатель на изменения настроек уведомлений.
 *
 * Отслеживает изменения как внутри текущей вкладки,
 * так и в localStorage из других вкладок.
 *
 * @param listener Функция, вызываемая при изменении настроек.
 * @returns Функция для отмены подписки.
 */
export function subscribeToNotificationSettings(listener: () => void) {
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
