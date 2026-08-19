// app/lib/sounds/useSoundSettings.ts
"use client";

import { useSyncExternalStore } from "react";

import {
  getServerSoundSettings,
  getSoundSettings,
  subscribeToSoundSettings,
  updateSoundSettings,
  type SoundSettings,
} from "./settings";

/**
 * Возвращает текущие настройки звука
 * и подписывает компонент на их изменения.
 *
 * Использует useSyncExternalStore для корректной
 * синхронизации внешнего хранилища с React.
 *
 * @returns Текущие настройки звука.
 */
export function useSoundSettings(): SoundSettings {
  return useSyncExternalStore(
    subscribeToSoundSettings,
    getSoundSettings,
    getServerSoundSettings,
  );
}

/**
 * Возвращает функцию для обновления настроек звука.
 *
 * @returns Функция обновления настроек звука.
 */
export function useUpdateSoundSettings() {
  return updateSoundSettings;
}
