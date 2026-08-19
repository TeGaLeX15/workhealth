// app/components/exercises/max-reps/useMaxReps.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MIN_REPS = 1;
const MAX_REPS = 1000;

/**
 * Управляет установкой личного максимума повторений для упражнения.
 *
 * Хук отвечает за:
 * - изменение количества повторений через кнопки;
 * - увеличение/уменьшение значения при удержании кнопки;
 * - ручной ввод количества повторений;
 * - валидацию и ограничение значения;
 * - сохранение максимума на сервере;
 * - создание новой тренировочной программы;
 * - переход к созданной тренировке;
 * - отображение состояния загрузки и ошибок.
 *
 * @param exerciseId Уникальный идентификатор упражнения.
 *
 * @returns Состояние и обработчики для управления максимумом повторений.
 */
export default function useMaxReps(exerciseId: string) {
  const router = useRouter();

  const [maxReps, setMaxReps] = useState(10);
  const [inputValue, setInputValue] = useState("10");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Изменяет количество максимальных повторений.
   *
   * Значение автоматически ограничивается диапазоном
   * от MIN_REPS до MAX_REPS.
   *
   * @param amount Количество повторений для изменения.
   * Может быть положительным или отрицательным.
   */
  const changeReps = useCallback((amount: number) => {
    setMaxReps((current) => {
      const next = Math.min(MAX_REPS, Math.max(MIN_REPS, current + amount));

      setInputValue(String(next));

      return next;
    });
  }, []);

  /**
   * Останавливает автоматическое изменение значения
   * при удержании кнопки.
   */
  const stopPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Запускает изменение количества повторений.
   *
   * При обычном нажатии значение изменяется один раз.
   * При длительном удержании после небольшой задержки
   * запускается автоматическое повторение с постепенно
   * увеличивающейся скоростью.
   *
   * @param direction Направление изменения:
   * 1 — увеличить количество повторений,
   * -1 — уменьшить количество повторений.
   */
  const startPress = useCallback(
    (direction: 1 | -1) => {
      if (isLoading) return;

      stopPress();
      changeReps(direction);

      timerRef.current = setTimeout(() => {
        let delay = 180;

        const repeat = () => {
          changeReps(direction);

          delay = Math.max(55, delay - 15);

          intervalRef.current = setTimeout(repeat, delay);
        };

        intervalRef.current = setTimeout(repeat, delay);
      }, 400);
    },
    [changeReps, isLoading, stopPress],
  );

  useEffect(() => {
    return () => stopPress();
  }, [stopPress]);

  /**
   * Обрабатывает ручной ввод количества повторений.
   *
   * Разрешает только целые положительные числа.
   * Значение автоматически ограничивается диапазоном
   * от MIN_REPS до MAX_REPS.
   */
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;

    if (rawValue === "") {
      setInputValue("");
      return;
    }

    if (!/^\d+$/.test(rawValue)) {
      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      return;
    }

    const clampedValue = Math.min(
      MAX_REPS,
      Math.max(MIN_REPS, Math.floor(value)),
    );

    setInputValue(String(clampedValue));
    setMaxReps(clampedValue);
  }

  /**
   * Сохраняет установленный максимум повторений.
   *
   * После успешного сохранения:
   * 1. создаёт новую тренировочную программу;
   * 2. получает идентификатор первой тренировки;
   * 3. перенаправляет пользователя на страницу тренировки.
   *
   * Во время выполнения повторная отправка блокируется.
   */
  async function handleSubmit() {
    if (isLoading) return;

    stopPress();
    setError("");
    setIsLoading(true);

    try {
      const maxResponse = await fetch(`/api/exercises/${exerciseId}/max`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxReps,
        }),
      });

      const maxData = await maxResponse.json();

      if (!maxResponse.ok) {
        setError(maxData.error ?? "Не удалось сохранить максимум");
        setIsLoading(false);
        return;
      }

      const weekResponse = await fetch("/api/training-weeks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseId,
        }),
      });

      const weekData = await weekResponse.json();

      if (!weekResponse.ok) {
        setError(weekData.error ?? "Не удалось создать программу");
        setIsLoading(false);
        return;
      }

      if (!weekData.workoutId) {
        setError("Тренировка не найдена");
        setIsLoading(false);
        return;
      }

      router.push(`/training/workouts/${weekData.workoutId}`);
    } catch {
      setError("Не удалось подключиться к серверу");
      setIsLoading(false);
    }
  }

  return {
    maxReps,
    inputValue,
    error,
    isLoading,
    changeReps,
    startPress,
    stopPress,
    handleInputChange,
    handleSubmit,
  };
}
