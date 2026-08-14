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

export function useNotificationSettings(): NotificationSettings {
  return useSyncExternalStore(
    subscribeToNotificationSettings,
    getNotificationSettings,
    getServerNotificationSettings,
  );
}

export function useUpdateNotificationSettings() {
  return updateNotificationSettings;
}
