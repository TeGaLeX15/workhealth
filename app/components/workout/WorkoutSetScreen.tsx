// app/components/workout/WorkoutSetScreen.tsx
"use client";

/**
 * Данные текущего подхода тренировки.
 */
type WorkoutSet = {
  /** Уникальный идентификатор подхода. */
  id: string;

  /** Порядковый номер подхода. */
  setNumber: number;

  /** Целевое количество повторений. */
  targetReps: number;

  /** Фактически выполненное количество повторений. */
  actualReps: number | null;

  /** Указывает, завершён ли подход. */
  completed: boolean;
};

/**
 * Пропсы экрана текущего подхода.
 */
type WorkoutSetScreenProps = {
  /** Текущий подход тренировки. */
  currentSet: WorkoutSet;

  /** Указывает, выполняется ли сохранение результата. */
  isLoading: boolean;

  /** Сообщение об ошибке при сохранении подхода. */
  error: string;

  /** Обработчик завершения текущего подхода. */
  onComplete: () => void;
};

/**
 * Экран выполнения текущего подхода.
 *
 * Показывает целевое количество повторений и позволяет пользователю
 * завершить подход нажатием на интерактивный круг.
 */
export default function WorkoutSetScreen({
  currentSet,
  isLoading,
  error,
  onComplete,
}: WorkoutSetScreenProps) {
  return (
    <div className="flex justify-center pt-10 pb-8 sm:pt-12 sm:pb-10">
      <div className="w-full text-center">
        <button
          type="button"
          onClick={onComplete}
          disabled={isLoading}
          aria-label={
            isLoading
              ? `Сохранение подхода ${currentSet.setNumber}`
              : `Завершить подход ${currentSet.setNumber}`
          }
          aria-busy={isLoading}
          className="
            bodyos-current-set
            relative
            mx-auto
            flex
            h-[min(68vw,270px)]
            w-[min(68vw,270px)]
            max-h-[270px]
            max-w-[270px]
            flex-col
            items-center
            justify-center
            rounded-full
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--accent)]
            focus-visible:ring-offset-4
            focus-visible:ring-offset-[var(--background)]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
          style={{
            backgroundColor: "var(--card)",
            border: "5px solid var(--accent)",
          }}
        >
          {/* IDLE PULSE */}

          <span
            aria-hidden="true"
            className="
              bodyos-current-set-pulse
              pointer-events-none
              absolute
              inset-[-4px]
              rounded-full
            "
            style={{
              border: "2px solid var(--accent)",
            }}
          />

          {/* CONTENT */}

          <span
            className="
              relative
              text-[clamp(64px,20vw,82px)]
              font-bold
              leading-none
              tracking-[-0.075em]
              tabular-nums
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {currentSet.targetReps}
          </span>

          <span
            className="
              relative
              mt-3
              text-[12px]
              font-medium
            "
            style={{
              color: "var(--muted)",
            }}
          >
            повторений
          </span>
        </button>

        {error ? (
          <div
            role="alert"
            className="
              mx-auto
              mt-4
              max-w-sm
              rounded-[17px]
              border
              px-4
              py-3
              text-center
              text-xs
              leading-relaxed
            "
            style={{
              backgroundColor: "color-mix(in srgb, #ef4444 6%, transparent)",
              borderColor: "color-mix(in srgb, #ef4444 20%, transparent)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        ) : (
          <p
            className="
              mt-8
              text-[11px]
              font-medium
              sm:text-xs
            "
            style={{
              color: "var(--muted)",
            }}
          >
            {isLoading
              ? "Сохраняем результат..."
              : "Выполни подход и нажми на круг"}
          </p>
        )}
      </div>
    </div>
  );
}
