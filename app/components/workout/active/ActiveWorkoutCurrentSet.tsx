// app/components/workout/active/ActiveWorkoutCurrentSet.tsx
import { Check } from "lucide-react";
import type { WorkoutSet } from "./types";

type ActiveWorkoutCurrentSetProps = {
  currentSet: WorkoutSet | null;
  completedSets: number;
  totalSets: number;
  isCompleted: boolean;
};

export default function ActiveWorkoutCurrentSet({
  currentSet,
  completedSets,
  totalSets,
  isCompleted,
}: ActiveWorkoutCurrentSetProps) {
  if (isCompleted) {
    return (
      <div className="px-5 pb-5">
        <div
          className="
            rounded-[24px]
            px-5
            py-6
            text-center
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent) 6%, var(--surface))",
          }}
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent) 13%, var(--surface))",
            }}
          >
            <Check
              size={26}
              strokeWidth={2.4}
              style={{
                color: "var(--accent)",
              }}
            />
          </div>

          <p
            className="
              mt-3
              text-[17px]
              font-bold
              tracking-[-0.025em]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            Готово
          </p>

          <p
            className="mt-1 text-[12px]"
            style={{
              color: "var(--muted)",
            }}
          >
            Все {totalSets} подходов выполнены
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-5">
      <div
        className="
          rounded-[24px]
          p-5
        "
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--accent) 7%, var(--surface))",
        }}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="
                  bodyos-pulse
                  h-2
                  w-2
                  rounded-full
                "
                style={{
                  backgroundColor: "var(--accent)",
                }}
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                "
                style={{
                  color: "var(--accent)",
                }}
              >
                Следующий подход
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span
                className="
                  text-[48px]
                  font-bold
                  leading-none
                  tracking-[-0.065em]
                "
                style={{
                  color: "var(--foreground)",
                }}
              >
                {currentSet?.targetReps}
              </span>

              <span
                className="text-[13px]"
                style={{
                  color: "var(--muted)",
                }}
              >
                повторений
              </span>
            </div>
          </div>

          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-[18px]
            "
            style={{
              backgroundColor: "var(--surface)",
              boxShadow:
                "0 2px 10px color-mix(in srgb, var(--foreground) 5%, transparent)",
            }}
          >
            <span
              className="
                text-[17px]
                font-bold
              "
              style={{
                color: "var(--accent)",
              }}
            >
              {currentSet?.setNumber}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span
            className="text-[11px]"
            style={{
              color: "var(--muted)",
            }}
          >
            Выполнено
          </span>

          <span
            className="
              text-[11px]
              font-semibold
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {completedSets} из {totalSets}
          </span>
        </div>
      </div>
    </div>
  );
}
