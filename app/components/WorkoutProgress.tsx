import { Check } from "lucide-react";

type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
};

type WorkoutProgressProps = {
  sets: WorkoutSet[];
  currentIndex: number;
  isResting: boolean;
};

export default function WorkoutProgress({
  sets,
  currentIndex,
  isResting,
}: WorkoutProgressProps) {
  return (
    <div className="mt-7">
      <div className="flex items-center justify-center">
        {sets.map((set, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={set.id}
              className="flex items-center"
            >
              {/* APPROACH */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`
                    relative
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    transition-all
                    duration-500
                    ${
                      isCurrent
                        ? "scale-110"
                        : ""
                    }
                  `}
                  style={{
                    backgroundColor: isCompleted
                      ? "color-mix(in srgb, var(--accent) 14%, transparent)"
                      : isCurrent
                        ? "color-mix(in srgb, var(--accent) 16%, var(--card))"
                        : "var(--surface)",

                    border: isCurrent
                      ? "1.5px solid var(--accent)"
                      : "1px solid var(--border)",

                    boxShadow: isCurrent
                      ? `
                        0 0 0 5px
                          color-mix(
                            in srgb,
                            var(--accent) 7%,
                            transparent
                          ),
                        0 0 24px
                          color-mix(
                            in srgb,
                            var(--accent) 18%,
                            transparent
                          )
                      `
                      : "none",
                  }}
                >
                  {isCompleted ? (
                    <Check
                      size={17}
                      strokeWidth={2.8}
                      style={{
                        color: "var(--accent)",
                      }}
                    />
                  ) : (
                    <span
                      className={`
                        text-xs
                        font-bold
                        tabular-nums
                        ${
                          isCurrent
                            ? "animate-pulse"
                            : ""
                        }
                      `}
                      style={{
                        color: isCurrent
                          ? "var(--accent)"
                          : "var(--muted)",
                      }}
                    >
                      {set.setNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* REST */}
              {index < sets.length - 1 && (
                <div className="flex items-center px-2">
                  <div
                    className="h-1.5 w-1.5 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor:
                        isResting &&
                        index === currentIndex - 1
                          ? "var(--accent)"
                          : isCompleted
                            ? "color-mix(in srgb, var(--accent) 25%, transparent)"
                            : "var(--border)",

                      boxShadow:
                        isResting &&
                        index === currentIndex - 1
                          ? "0 0 10px color-mix(in srgb, var(--accent) 40%, transparent)"
                          : "none",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-center">
        <span
          className="text-[11px] font-medium"
          style={{
            color: "var(--muted)",
          }}
        >
          {isResting
            ? "Восстановление"
            : `Подход ${currentIndex + 1} из ${sets.length}`}
        </span>
      </div>
    </div>
  );
}