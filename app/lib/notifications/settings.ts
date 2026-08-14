// app/lib/notifications/settings.ts
export type NotificationSettings = {
  enabled: boolean;

  workoutReminder: boolean;
  missedWorkout: boolean;

  restTimer: boolean;
  nextSet: boolean;

  newMax: boolean;
  goalReached: boolean;

  weeklyReport: boolean;
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,

  workoutReminder: true,
  missedWorkout: true,

  restTimer: true,
  nextSet: false,

  newMax: true,
  goalReached: true,

  weeklyReport: true,
};

const STORAGE_KEY = "bodyos_notification_settings";

let cachedSettings: NotificationSettings = DEFAULT_NOTIFICATION_SETTINGS;
let initialized = false;

const listeners = new Set<() => void>();

function isNotificationSettings(value: unknown): value is NotificationSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.enabled === "boolean" &&
    typeof settings.workoutReminder === "boolean" &&
    typeof settings.missedWorkout === "boolean" &&
    typeof settings.restTimer === "boolean" &&
    typeof settings.nextSet === "boolean" &&
    typeof settings.newMax === "boolean" &&
    typeof settings.goalReached === "boolean" &&
    typeof settings.weeklyReport === "boolean"
  );
}

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
    // Ignore corrupted/unavailable localStorage.
    cachedSettings = DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function getNotificationSettings(): NotificationSettings {
  initializeSettings();

  return cachedSettings;
}

export function getServerNotificationSettings(): NotificationSettings {
  return DEFAULT_NOTIFICATION_SETTINGS;
}

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
      // Storage may be unavailable. Keep the in-memory state.
    }
  }

  listeners.forEach((listener) => {
    listener();
  });
}

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
