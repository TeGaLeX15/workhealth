// app/lib/notifications/useNotificationSettings.ts
"use client";

import { useSyncExternalStore } from "react";

import {
  getNotificationSettings,
  getServerNotificationSettings,
  subscribeToNotificationSettings,
  updateNotificationSettings,
  type NotificationSettings,
} from "./settings";

/**
 * Возвращает текущие настройки уведомлений
 * и подписывает компонент на их изменения.
 *
 * @returns Текущие настройки уведомлений.
 */
export function useNotificationSettings(): NotificationSettings {
  return useSyncExternalStore(
    subscribeToNotificationSettings,
    getNotificationSettings,
    getServerNotificationSettings,
  );
}

/**
 * Возвращает функцию для обновления настроек уведомлений.
 *
 * @returns Функция обновления настроек уведомлений.
 */
export function useUpdateNotificationSettings() {
  return updateNotificationSettings;
}
