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

/**
 * Управляет звуковыми и вибрационными событиями таймера отдыха.
 *
 * Компонент не отображает UI. Он отслеживает состояние таймера,
 * воспроизводит звуки обратного отсчёта и завершения отдыха,
 * вызывает вибрацию при завершении и уведомляет родительский
 * компонент о завершении периода отдыха.
 *
 * Для воспроизведения звуков используется Web Audio API.
 *
 * @param props - Свойства компонента.
 * @param props.restSeconds - Количество оставшихся секунд отдыха.
 * @param props.isResting - Находится ли тренировка в состоянии отдыха.
 * @param props.countdownEnabled - Включён ли звук обратного отсчёта.
 * @param props.completeEnabled - Включён ли звук завершения отдыха.
 * @param props.onComplete - Обработчик завершения периода отдыха.
 *
 * @returns Всегда возвращает `null`, так как компонент не содержит UI.
 */
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
   * Сохраняем актуальный обработчик завершения
   * без перезапуска эффекта обработки таймера.
   */
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  /*
   * Получает существующий или создаёт новый
   * контекст Web Audio.
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
   * Загружает и декодирует звуковой файл.
   */
  const loadSound = useCallback(
    async (context: AudioContext, url: string): Promise<AudioBuffer> => {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Не удалось загрузить звук: ${url}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      return context.decodeAudioData(arrayBuffer);
    },
    [],
  );

  /*
   * Подготавливает все звуки таймера отдыха.
   *
   * Звуки загружаются, если включён хотя бы один
   * из параметров звукового сопровождения.
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
      // Звуковое сопровождение необязательно.
    } finally {
      isLoadingRef.current = false;
    }
  }, [countdownEnabled, completeEnabled, getAudioContext, loadSound]);

  /*
   * Воспроизводит декодированный звуковой буфер.
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
   * Подготавливает звуки, если включено хотя бы одно
   * звуковое событие таймера.
   */
  useEffect(() => {
    if (!countdownEnabled && !completeEnabled) {
      return;
    }

    void prepareAudio();
  }, [countdownEnabled, completeEnabled, prepareAudio]);

  /*
   * Обрабатывает события таймера.
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
     * Игнорируем первое обновление нового периода отдыха.
     */
    if (previousSeconds === null) {
      completedRef.current = false;

      return;
    }

    /*
     * Период отдыха завершён.
     */
    if (restSeconds === 0) {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;

      /*
       * Воспроизводим звук завершения отдыха.
       */
      if (completeEnabled) {
        void playSound(completeBufferRef.current);
      }

      /*
       * Вибрация относится к событию завершения отдыха.
       *
       * Она не зависит от настроек звука.
       */
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(VIBRATION_DURATION);
      }

      /*
       * Переходим к следующему подходу после того,
       * как состояние 0 будет отображено и событие
       * завершения будет обработано.
       */
      window.setTimeout(() => {
        onCompleteRef.current();
      }, 0);

      return;
    }

    /*
     * Обратный отсчёт: 3 → 2 → 1.
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
   * Освобождаем ресурсы Web Audio при размонтировании компонента.
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
