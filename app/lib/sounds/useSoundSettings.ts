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

export function useSoundSettings(): SoundSettings {
  return useSyncExternalStore(
    subscribeToSoundSettings,
    getSoundSettings,
    getServerSoundSettings,
  );
}

export function useUpdateSoundSettings() {
  return updateSoundSettings;
}
