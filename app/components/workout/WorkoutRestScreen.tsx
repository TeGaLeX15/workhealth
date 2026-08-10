// app/components/workout/WorkoutRestScreen.tsx
"use client";

import { Plus, SkipForward } from "lucide-react";

type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
};

type WorkoutRestScreenProps = {
  currentSet: WorkoutSet;
  restSeconds: number;
  restTotalSeconds: number;
  onSkip: () => void;
  onIncrease: () => void;
};

export default function WorkoutRestScreen({
  currentSet,
  restSeconds,
  restTotalSeconds,
  onSkip,
  onIncrease,
}: WorkoutRestScreenProps) {
  const progress = ((restTotalSeconds - restSeconds) / restTotalSeconds) * 100;

  const minutes = Math.floor(restSeconds / 60);
  const seconds = restSeconds % 60;

  return (
    <div className="w-full">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.13em]
            "
            style={{
              color: "var(--accent)",
            }}
          >
            Восстановление
          </p>

          <h2
            className="
              mt-1
              text-[24px]
              font-bold
              leading-none
              tracking-[-0.045em]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            Отдых
          </h2>
        </div>

        <div
          className="
            shrink-0
            rounded-full
            px-3
            py-1.5
            text-[11px]
            font-semibold
          "
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--muted)",
          }}
        >
          Дальше · {currentSet.targetReps}
        </div>
      </div>

      {/* TIMER */}

      <div className="flex justify-center py-8 sm:py-10">
        <div
          className="
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
          style={{
            background: `conic-gradient(
              var(--accent) ${progress}%,
              var(--surface) ${progress}% 100%
            )`,
            boxShadow:
              "0 18px 50px color-mix(in srgb, var(--accent) 8%, transparent)",
          }}
        >
          <div
            className="
              absolute
              inset-[6px]
              rounded-full
            "
            style={{
              backgroundColor: "var(--card)",
            }}
          />

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
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
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
            flex
            h-[52px]
            min-w-0
            flex-1
            items-center
            justify-center
            gap-2
            rounded-[18px]
            border
            text-[13px]
            font-semibold
            transition-transform
            active:scale-[0.98]
          "
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <SkipForward size={16} strokeWidth={2} />
          Пропустить
        </button>

        <button
          type="button"
          onClick={onIncrease}
          className="
            flex
            h-[52px]
            shrink-0
            items-center
            justify-center
            gap-1.5
            rounded-[18px]
            border
            px-4
            text-[13px]
            font-semibold
            transition-transform
            active:scale-[0.98]
          "
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <Plus size={15} strokeWidth={2} />
          30 сек
        </button>
      </div>
    </div>
  );
}
