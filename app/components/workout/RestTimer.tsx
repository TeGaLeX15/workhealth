// app/components/workout/RestTimer.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";

type RestTimerProps = {
  restSeconds: number;
  isResting: boolean;
  countdownEnabled: boolean;
  completeEnabled: boolean;
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
  countdownEnabled,
  completeEnabled,
  onComplete,
}: RestTimerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const countdownBufferRef = useRef<AudioBuffer | null>(null);
  const completeBufferRef = useRef<AudioBuffer | null>(null);

  const previousSecondsRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const isLoadingRef = useRef(false);

  const onCompleteRef = useRef(onComplete);

  /*
   * Keep the latest completion callback without
   * restarting the timer event effect.
   */
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  /*
   * Get or create the Web Audio context.
   */
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

  /*
   * Load and decode a sound.
   */
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

  /*
   * Prepare all rest sounds.
   *
   * Audio is loaded when at least one rest sound is enabled.
   */
  const prepareAudio = useCallback(async () => {
    if (!countdownEnabled && !completeEnabled) {
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
  }, [countdownEnabled, completeEnabled, getAudioContext, loadSound]);

  /*
   * Play a decoded sound.
   */
  const playSound = useCallback(
    async (buffer: AudioBuffer | null) => {
      if (!buffer) {
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
    [getAudioContext],
  );

  /*
   * Prepare audio whenever at least one sound is enabled.
   */
  useEffect(() => {
    if (!countdownEnabled && !completeEnabled) {
      return;
    }

    void prepareAudio();
  }, [countdownEnabled, completeEnabled, prepareAudio]);

  /*
   * Handle timer events.
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
     * Rest completed.
     */
    if (restSeconds === 0) {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;

      /*
       * Completion sound.
       */
      if (completeEnabled) {
        void playSound(completeBufferRef.current);
      }

      /*
       * Vibration belongs to the rest completion event.
       *
       * It is independent from sound settings.
       */
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(VIBRATION_DURATION);
      }

      /*
       * Move to the next set after the 0 state
       * has been rendered and the completion event
       * has been triggered.
       */
      window.setTimeout(() => {
        onCompleteRef.current();
      }, 0);

      return;
    }

    /*
     * Countdown: 3 → 2 → 1.
     */
    if (
      countdownEnabled &&
      restSeconds >= COUNTDOWN_START &&
      restSeconds <= COUNTDOWN_END
    ) {
      void playSound(countdownBufferRef.current);
    }
  }, [restSeconds, isResting, countdownEnabled, completeEnabled, playSound]);

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
