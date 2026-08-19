// app/components/StartWorkoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";

type StartWorkoutButtonProps = {
  workoutId: string;
};

type StartWorkoutResponse = {
  error?: string;
};

/**
 * Кнопка запуска тренировки.
 *
 * Отправляет запрос на сервер для запуска тренировки, предотвращает
 * повторную отправку во время выполнения запроса и отображает состояния
 * загрузки, успешного запуска и ошибки.
 *
 * @param props - Свойства компонента.
 * @param props.workoutId - Идентификатор тренировки.
 *
 * @returns Кнопка запуска тренировки с обработкой состояний.
 */
export default function StartWorkoutButton({
  workoutId,
}: StartWorkoutButtonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState("");

  /**
   * Запускает тренировку через API.
   *
   * После успешного запуска обновляет server-rendered состояние страницы.
   */
  async function handleStart() {
    if (isLoading || isStarted) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/workouts/${workoutId}/start`, {
        method: "POST",
        cache: "no-store",
      });

      let data: StartWorkoutResponse = {};

      try {
        data = await response.json();
      } catch {
        // Сервер вернул ответ без корректного JSON.
      }

      if (!response.ok) {
        setError(
          data.error ?? "Не удалось запустить тренировку. Попробуйте ещё раз.",
        );
        return;
      }

      // Сервер подтвердил успешный запуск.
      setIsStarted(true);

      // Обновляем server-rendered состояние страницы.
      router.refresh();
    } catch {
      setError(
        "Не удалось подключиться. Проверьте соединение и попробуйте ещё раз.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      {error && (
        <p
          role="alert"
          className="
            mb-3
            rounded-[14px]
            px-3
            py-2.5
            text-center
            text-xs
            leading-relaxed
          "
          style={{
            color: "#ef4444",
            backgroundColor: "color-mix(in srgb, #ef4444 7%, transparent)",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={isLoading || isStarted}
        aria-busy={isLoading}
        aria-disabled={isStarted}
        className="
          flex
          h-14
          w-full
          items-center
          justify-center
          gap-2
          rounded-[18px]
          text-[15px]
          font-semibold
          text-white
          transition-all
          duration-150
          hover:brightness-[1.04]
          active:scale-[0.985]
          disabled:cursor-not-allowed
          disabled:opacity-50
          motion-reduce:transition-none
        "
        style={{
          backgroundColor: isStarted
            ? "color-mix(in srgb, var(--accent) 75%, var(--surface))"
            : "var(--accent)",
        }}
      >
        {isLoading ? (
          <>
            <LoaderCircle
              size={18}
              strokeWidth={2}
              className="animate-spin"
              aria-hidden="true"
            />

            <span>Запускаем…</span>
          </>
        ) : isStarted ? (
          <>
            <Check size={18} strokeWidth={2.2} aria-hidden="true" />

            <span>Тренировка запущена</span>
          </>
        ) : (
          <>
            <span>Начать тренировку</span>

            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}
