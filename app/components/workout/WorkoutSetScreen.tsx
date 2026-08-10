// app/components/workout/WorkoutSetScreen.tsx
"use client";

type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
};

type WorkoutSetScreenProps = {
  currentSet: WorkoutSet;
  isLoading: boolean;
  error: string;
  onComplete: () => void;
};

export default function WorkoutSetScreen({
  currentSet,
  isLoading,
  error,
  onComplete,
}: WorkoutSetScreenProps) {
  return (
    <div className="flex justify-center py-8 sm:py-10">
      <div className="w-full text-center">
        <button
          type="button"
          onClick={onComplete}
          disabled={isLoading}
          aria-label={`Завершить подход ${currentSet.setNumber}`}
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
            transition-transform
            active:scale-[0.96]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
          style={{
            backgroundColor: "var(--card)",
            border:
              "1px solid color-mix(in srgb, var(--accent) 18%, var(--border))",
            boxShadow:
              "0 18px 50px color-mix(in srgb, var(--accent) 8%, transparent)",
          }}
        >
          <div
            className="
              absolute
              inset-[6px]
              rounded-full
              border-2
              sm:inset-[8px]
            "
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 24%, transparent)",
            }}
          />

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

        {error && (
          <div
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
            "
            style={{
              backgroundColor: "color-mix(in srgb, #ef4444 6%, transparent)",
              borderColor: "color-mix(in srgb, #ef4444 20%, transparent)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        {!error && (
          <p
            className="
              mt-4
              text-[11px]
              font-medium
              sm:text-xs
            "
            style={{
              color: "var(--muted)",
            }}
          >
            Выполни подход и нажми на круг
          </p>
        )}
      </div>
    </div>
  );
}
