// app/components/workout/RestTimer.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";

type RestTimerProps = {
  restSeconds: number;
  isResting: boolean;
  onComplete: () => void;
};

const COUNTDOWN_START = 1;
const COUNTDOWN_END = 3;

const VIBRATION_DURATION = 200;

const COUNTDOWN_SOUND = "/sounds/rest-countdown.mp3";
const COMPLETE_SOUND = "/sounds/rest-complete.mp3";

export default function RestTimer({
  restSeconds,
  isResting,
  onComplete,
}: RestTimerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const countdownBufferRef = useRef<AudioBuffer | null>(null);
  const completeBufferRef = useRef<AudioBuffer | null>(null);

  const previousSecondsRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const isLoadingRef = useRef(false);
  const preparationPromiseRef = useRef<Promise<void> | null>(null);

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
      try {
        await context.resume();
      } catch {
        return null;
      }
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
    if (countdownBufferRef.current && completeBufferRef.current) {
      return;
    }

    if (preparationPromiseRef.current) {
      return preparationPromiseRef.current;
    }

    const promise = (async () => {
      if (isLoadingRef.current) {
        return;
      }

      isLoadingRef.current = true;

      try {
        const context = await getAudioContext();

        if (!context) {
          return;
        }

        const [countdownBuffer, completeBuffer] = await Promise.all([
          loadSound(context, COUNTDOWN_SOUND),
          loadSound(context, COMPLETE_SOUND),
        ]);

        countdownBufferRef.current = countdownBuffer;
        completeBufferRef.current = completeBuffer;
      } catch {
        // Audio is optional.
        // Workout must continue even if audio fails.
      } finally {
        isLoadingRef.current = false;
      }
    })();

    preparationPromiseRef.current = promise;

    try {
      await promise;
    } finally {
      preparationPromiseRef.current = null;
    }
  }, [getAudioContext, loadSound]);

  /*
   * Called directly from the user's "Complete set" action.
   *
   * This gives mobile browsers a user gesture from which
   * AudioContext can be created/resumed.
   */
  const activateAudio = useCallback(async () => {
    await prepareAudio();
  }, [prepareAudio]);

  const playSound = useCallback(
    async (buffer: AudioBuffer | null) => {
      if (!buffer) {
        return;
      }

      const context = await getAudioContext();

      if (!context) {
        return;
      }

      if (context.state !== "running") {
        return;
      }

      const source = context.createBufferSource();

      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    },
    [getAudioContext],
  );

  /*
   * Expose audio activation through a custom event.
   *
   * WorkoutSession dispatches this immediately from the
   * user's click handler.
   */
  useEffect(() => {
    const handleActivateAudio = () => {
      void activateAudio();
    };

    window.addEventListener("bodyos:activate-rest-audio", handleActivateAudio);

    return () => {
      window.removeEventListener(
        "bodyos:activate-rest-audio",
        handleActivateAudio,
      );
    };
  }, [activateAudio]);

  /*
   * Best-effort preparation on mount.
   *
   * The important activation happens again from the user's
   * button press above.
   */
  useEffect(() => {
    void prepareAudio();

    return () => {
      void audioContextRef.current?.close();

      audioContextRef.current = null;
      countdownBufferRef.current = null;
      completeBufferRef.current = null;
      preparationPromiseRef.current = null;
    };
  }, [prepareAudio]);

  /*
   * Reset event state whenever a rest period starts/ends.
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
     * Ignore the first render of a rest period.
     */
    if (previousSeconds === null) {
      completedRef.current = false;
      return;
    }

    /*
     * Completion.
     *
     * IMPORTANT:
     * The completion callback is called only after the
     * finishing sound has been started.
     */
    if (restSeconds === 0) {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;

      void (async () => {
        await playSound(completeBufferRef.current);

        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(VIBRATION_DURATION);
        }

        onComplete();
      })();

      return;
    }

    /*
     * Countdown: 3 → 2 → 1.
     */
    if (restSeconds >= COUNTDOWN_START && restSeconds <= COUNTDOWN_END) {
      void playSound(countdownBufferRef.current);
    }
  }, [restSeconds, isResting, playSound, onComplete]);

  return null;
}
