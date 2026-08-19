// app/components/workout/WorkoutRestScreen.tsx
"use client";

import { Plus, SkipForward } from "lucide-react";

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
 * Пропсы экрана отдыха между подходами.
 */
type WorkoutRestScreenProps = {
  /** Следующий подход, который будет выполнен после отдыха. */
  currentSet: WorkoutSet;

  /** Оставшееся время отдыха в секундах. */
  restSeconds: number;

  /** Общая продолжительность текущего периода отдыха в секундах. */
  restTotalSeconds: number;

  /** Обработчик досрочного завершения отдыха. */
  onSkip: () => void;

  /** Обработчик добавления 30 секунд к отдыху. */
  onIncrease: () => void;
};

/**
 * Экран отдыха между подходами.
 *
 * Отображает круговой таймер, информацию о следующем подходе
 * и действия для управления продолжительностью отдыха.
 */
export default function WorkoutRestScreen({
  currentSet,
  restSeconds,
  restTotalSeconds,
  onSkip,
  onIncrease,
}: WorkoutRestScreenProps) {
  const progress =
    restTotalSeconds > 0
      ? ((restTotalSeconds - restSeconds) / restTotalSeconds) * 100
      : 0;

  const minutes = Math.floor(restSeconds / 60);
  const seconds = restSeconds % 60;

  const formattedTime = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="w-full">
      {/* TIMER */}

      <div className="flex justify-center pt-10 pb-8 sm:pt-12 sm:pb-10">
        <div
          className="
            bodyos-rest-timer
            relative
            flex
            h-[min(68vw,270px)]
            w-[min(68vw,270px)]
            max-h-[270px]
            max-w-[270px]
            items-center
            justify-center
            rounded-full
          "
          role="timer"
          aria-label={`Время отдыха ${formattedTime}`}
          aria-live="off"
          style={{
            background: `conic-gradient(
              var(--accent) ${progress}%,
              color-mix(in srgb, var(--border) 65%, transparent) ${progress}% 100%
            )`,
            boxShadow:
              "0 18px 50px color-mix(in srgb, var(--accent) 10%, transparent)",
          }}
        >
          {/* INNER CIRCLE */}

          <div
            aria-hidden="true"
            className="
              absolute
              inset-[8px]
              rounded-full
            "
            style={{
              backgroundColor: "var(--card)",
            }}
          />

          {/* TIMER CONTENT */}

          <div className="relative text-center">
            <div
              className="
                text-[clamp(48px,16vw,64px)]
                font-bold
                leading-none
                tracking-[-0.075em]
                tabular-nums
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              {formattedTime}
            </div>

            <div
              className="
                mt-3
                text-[11px]
                font-medium
              "
              style={{
                color: "var(--muted)",
              }}
            >
              время отдыха
            </div>
          </div>
        </div>
      </div>

      {/* NEXT SET */}

      <div
        className="
          rounded-[21px]
          border
          px-4
          py-3.5
        "
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p
              className="text-[11px]"
              style={{
                color: "var(--muted)",
              }}
            >
              Следующий подход
            </p>

            <p
              className="
                mt-1
                truncate
                text-[16px]
                font-bold
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              Подход {currentSet.setNumber}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span
              className="
                text-[22px]
                font-bold
                tracking-[-0.04em]
                tabular-nums
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              {currentSet.targetReps}
            </span>

            <span
              className="ml-1 text-[11px]"
              style={{
                color: "var(--muted)",
              }}
            >
              раз
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="mt-3 flex gap-2.5">
        <button
          type="button"
          onClick={onSkip}
          className="
            bodyos-action-button
            touch-manipulation
            flex
            h-[52px]
            min-w-0
            flex-[1.6]
            items-center
            justify-center
            gap-2
            rounded-[18px]
            border
            text-[13px]
            font-semibold
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--accent)]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[var(--background)]
          "
          style={{
            backgroundColor: "var(--accent)",
            borderColor: "var(--accent)",
            color: "var(--accent-foreground)",
          }}
        >
          <SkipForward size={16} strokeWidth={2.2} />
          Закончить отдых
        </button>

        <button
          type="button"
          onClick={onIncrease}
          aria-label="Добавить 30 секунд отдыха"
          className="
            bodyos-action-button
            touch-manipulation
            flex
            h-[52px]
            w-[92px]
            shrink-0
            items-center
            justify-center
            gap-1.5
            rounded-[18px]
            border
            text-[13px]
            font-semibold
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--accent)]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[var(--background)]
          "
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <Plus size={15} strokeWidth={2.2} />
          30 сек
        </button>
      </div>
    </div>
  );
}
