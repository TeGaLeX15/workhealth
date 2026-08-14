export type SoundSettings = {
  enabled: boolean;

  restCountdown: boolean;
  restComplete: boolean;

  workoutComplete: boolean;
  newMax: boolean;
};

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

export function getSoundSettings(): SoundSettings {
  initializeSettings();

  return cachedSettings;
}

export function getServerSoundSettings(): SoundSettings {
  return DEFAULT_SOUND_SETTINGS;
}

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
      // Keep in-memory state if localStorage is unavailable.
    }
  }

  listeners.forEach((listener) => {
    listener();
  });
}

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
