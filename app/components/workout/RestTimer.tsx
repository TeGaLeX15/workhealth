// app/components/workout/RestTimer.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";

type RestTimerProps = {
  restSeconds: number;
  isResting: boolean;
  enabled: boolean;
};

const COUNTDOWN_START = 1;
const COUNTDOWN_END = 3;

const VIBRATION_DURATION = 200;

const COUNTDOWN_SOUND = "/sounds/rest-countdown.mp3";
const COMPLETE_SOUND = "/sounds/rest-complete.mp3";

export default function RestTimer({
  restSeconds,
  isResting,
  enabled,
}: RestTimerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const countdownBufferRef = useRef<AudioBuffer | null>(null);

  const completeBufferRef = useRef<AudioBuffer | null>(null);

  const previousSecondsRef = useRef<number | null>(null);

  const completedRef = useRef(false);

  const isLoadingRef = useRef(false);

  const getAudioContext = useCallback(async () => {
    if (typeof window === "undefined") {
      return null;
    }

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      audioContextRef.current = new AudioContextClass();
    }

    const context = audioContextRef.current;

    if (context.state === "suspended") {
      await context.resume();
    }

    return context;
  }, []);

  const loadSound = useCallback(
    async (context: AudioContext, url: string): Promise<AudioBuffer> => {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load sound: ${url}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      return context.decodeAudioData(arrayBuffer);
    },
    [],
  );

  const prepareAudio = useCallback(async () => {
    if (!enabled) {
      return;
    }

    if (isLoadingRef.current) {
      return;
    }

    if (countdownBufferRef.current && completeBufferRef.current) {
      return;
    }

    const context = await getAudioContext();

    if (!context) {
      return;
    }

    isLoadingRef.current = true;

    try {
      const [countdownBuffer, completeBuffer] = await Promise.all([
        loadSound(context, COUNTDOWN_SOUND),
        loadSound(context, COMPLETE_SOUND),
      ]);

      countdownBufferRef.current = countdownBuffer;

      completeBufferRef.current = completeBuffer;
    } catch {
      // Audio is optional.
    } finally {
      isLoadingRef.current = false;
    }
  }, [enabled, getAudioContext, loadSound]);

  const playSound = useCallback(
    async (buffer: AudioBuffer | null) => {
      if (!enabled || !buffer) {
        return;
      }

      const context = await getAudioContext();

      if (!context) {
        return;
      }

      const source = context.createBufferSource();

      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    },
    [enabled, getAudioContext],
  );

  /*
   * Prepare audio whenever the feature is enabled.
   */
  useEffect(() => {
    if (!enabled) {
      return;
    }

    void prepareAudio();
  }, [enabled, prepareAudio]);

  /*
   * Reset timer event state when resting ends.
   */
  useEffect(() => {
    if (!isResting) {
      previousSecondsRef.current = null;
      completedRef.current = false;
      return;
    }

    const previousSeconds = previousSecondsRef.current;

    previousSecondsRef.current = restSeconds;

    /*
     * Ignore the first render of a new rest period.
     */
    if (previousSeconds === null) {
      completedRef.current = false;
      return;
    }

    /*
     * Completion event.
     */
    if (restSeconds === 0) {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;

      if (enabled) {
        void playSound(completeBufferRef.current);

        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(VIBRATION_DURATION);
        }
      }

      return;
    }

    /*
     * Countdown: 3 → 2 → 1.
     */
    if (
      enabled &&
      restSeconds >= COUNTDOWN_START &&
      restSeconds <= COUNTDOWN_END
    ) {
      void playSound(countdownBufferRef.current);
    }
  }, [restSeconds, isResting, enabled, playSound]);

  /*
   * Release Web Audio resources on unmount.
   */
  useEffect(() => {
    return () => {
      void audioContextRef.current?.close();

      audioContextRef.current = null;

      countdownBufferRef.current = null;
      completeBufferRef.current = null;
    };
  }, []);

  return null;
}
