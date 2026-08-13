// app/components/workout/RestTimer.tsx
"use client";

import { useEffect, useRef } from "react";

type RestTimerProps = {
  restSeconds: number;
};

export default function RestTimer({ restSeconds }: RestTimerProps) {
  const countdownSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const countdownSound = new Audio("/sounds/rest-countdown.mp3");
    const completeSound = new Audio("/sounds/rest-complete.mp3");

    countdownSound.preload = "auto";
    completeSound.preload = "auto";

    countdownSoundRef.current = countdownSound;
    completeSoundRef.current = completeSound;

    return () => {
      countdownSound.pause();
      completeSound.pause();

      countdownSoundRef.current = null;
      completeSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (restSeconds >= 1 && restSeconds <= 3) {
      const audio = countdownSoundRef.current;

      if (!audio) {
        return;
      }

      audio.currentTime = 0;
      void audio.play().catch(() => {});

      return;
    }

    if (restSeconds === 0) {
      const audio = completeSoundRef.current;

      if (audio) {
        audio.currentTime = 0;
        void audio.play().catch(() => {});
      }

      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
    }
  }, [restSeconds]);

  return null;
}
