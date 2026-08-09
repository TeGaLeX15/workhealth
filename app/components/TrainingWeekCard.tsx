// app/components/TrainingWeekCard.tsx
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
  completedAt: Date | null;
  workoutId: string;
};

type Workout = {
  id: string;
  workoutNumber: number;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  sets: WorkoutSet[];
};

type TrainingWeekCardProps = {
  weekNumber: number;
  workouts: Workout[];
};

function getStatusLabel(status: Workout["status"]) {
  switch (status) {
    case "PLANNED":
      return "Запланирована";
    case "IN_PROGRESS":
      return "В процессе";
    case "COMPLETED":
      return "Выполнена";
    case "CANCELLED":
      return "Отменена";
  }
}

function getStatusStyle(status: Workout["status"]) {
  switch (status) {
    case "IN_PROGRESS":
      return {
        backgroundColor:
          "color-mix(in srgb, var(--accent) 12%, var(--surface))",
        color: "var(--accent)",
      };

    case "COMPLETED":
      return {
        backgroundColor:
          "color-mix(in srgb, var(--accent) 10%, var(--surface))",
        color: "var(--accent)",
      };

    case "CANCELLED":
      return {
        backgroundColor:
          "color-mix(in srgb, #ef4444 8%, var(--surface))",
        color: "#ef4444",
      };

    default:
      return {
        backgroundColor:
          "color-mix(in srgb, var(--muted) 8%, var(--surface))",
        color: "var(--muted)",
      };
  }
}

function getWorkoutCardStyle(status: Workout["status"]) {
  switch (status) {
    case "IN_PROGRESS":
      return {
        backgroundColor:
          "color-mix(in srgb, var(--accent) 3%, var(--card))",
        borderColor:
          "color-mix(in srgb, var(--accent) 35%, var(--border))",
        boxShadow:
          "0 8px 28px color-mix(in srgb, var(--accent) 7%, transparent)",
      };

    case "COMPLETED":
      return {
        backgroundColor: "var(--card)",
        borderColor:
          "color-mix(in srgb, var(--accent) 16%, var(--border))",
      };

    case "CANCELLED":
      return {
        backgroundColor:
          "color-mix(in srgb, #ef4444 1%, var(--card))",
        borderColor:
          "color-mix(in srgb, #ef4444 16%, var(--border))",
      };

    default:
      return {
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      };
  }
}

export default function TrainingWeekCard({
  weekNumber,
  workouts,
}: TrainingWeekCardProps) {
  return (
    <section>
      {/* Week header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{
              color: "var(--accent)",
            }}
          >
            Тренировочная неделя
          </p>

          <h3
            className="mt-1 text-[20px] font-bold tracking-[-0.035em]"
            style={{
              color: "var(--foreground)",
            }}
          >
            Неделя {weekNumber}
          </h3>
        </div>

        <span
          className="rounded-full px-3 py-1.5 text-[11px] font-semibold"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--muted) 7%, var(--surface))",
            color: "var(--muted)",
          }}
        >
          {workouts.length}{" "}
          {workouts.length === 1 ? "тренировка" : "тренировки"}
        </span>
      </div>

      {/* Workouts */}
      <div className="space-y-3">
        {workouts.map((workout) => {
          const completedSets = workout.sets.filter(
            (set) => set.completed,
          ).length;

          const totalSets = workout.sets.length;

          const progress =
            totalSets > 0
              ? Math.round((completedSets / totalSets) * 100)
              : 0;

          const isInProgress =
            workout.status === "IN_PROGRESS";

          const isCompleted =
            workout.status === "COMPLETED";

          const isCancelled =
            workout.status === "CANCELLED";

          const currentSetIndex = workout.sets.findIndex(
            (set) => !set.completed,
          );

          return (
            <Link
              key={workout.id}
              href={`/workouts/${workout.id}`}
              className={[
                "group relative block overflow-hidden",
                "rounded-[24px] border",
                "transition-all duration-200",
                "active:scale-[0.985]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[var(--accent)]",
                isCancelled ? "opacity-70" : "",
              ].join(" ")}
              style={getWorkoutCardStyle(workout.status)}
            >
              {/* Active indicator */}
              {isInProgress && (
                <div
                  className="h-1 w-full"
                  style={{
                    backgroundColor: "var(--accent)",
                  }}
                />
              )}

              {/* Header */}
              <div className="px-4 pb-3 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Тренировка
                    </p>

                    <h4
                      className="mt-1 text-[19px] font-bold leading-tight tracking-[-0.03em]"
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      #{workout.workoutNumber}
                    </h4>
                  </div>

                  <span
                    className="shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-semibold leading-none"
                    style={getStatusStyle(workout.status)}
                  >
                    {getStatusLabel(workout.status)}
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-[16px] font-bold"
                        style={{
                          color: "var(--foreground)",
                        }}
                      >
                        {completedSets}
                      </span>

                      <span
                        className="text-[12px]"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        из {totalSets} подходов
                      </span>
                    </div>

                    {isInProgress && (
                      <span
                        className="text-[11px] font-bold"
                        style={{
                          color: "var(--accent)",
                        }}
                      >
                        {progress}%
                      </span>
                    )}
                  </div>

                  <div
                    className="mt-2 h-1.5 overflow-hidden rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--muted) 9%, var(--background))",
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: "var(--accent)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Sets */}
              <div
                className="border-t px-4 py-3.5"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor:
                    "color-mix(in srgb, var(--background) 35%, var(--card))",
                }}
              >
                <div
                  className="grid gap-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${Math.max(
                      workout.sets.length,
                      1,
                    )}, minmax(0, 1fr))`,
                  }}
                >
                  {workout.sets.map((set, index) => {
                    const completed = set.completed;

                    const current =
                      isInProgress &&
                      currentSetIndex !== -1 &&
                      index === currentSetIndex;

                    const upcoming =
                      !completed && !current;

                    return (
                      <div
                        key={set.id}
                        className="relative flex min-h-[64px] min-w-0 flex-col items-center justify-center overflow-hidden rounded-[16px] border"
                        style={{
                          borderColor: completed
                            ? "color-mix(in srgb, var(--accent) 25%, var(--border))"
                            : current
                              ? "color-mix(in srgb, var(--accent) 55%, var(--border))"
                              : "color-mix(in srgb, var(--border) 55%, transparent)",
                          backgroundColor: completed
                            ? "color-mix(in srgb, var(--accent) 8%, var(--surface))"
                            : current
                              ? "color-mix(in srgb, var(--accent) 14%, var(--surface))"
                              : "var(--surface)",
                          opacity: upcoming ? 0.55 : 1,
                        }}
                      >
                        {current && (
                          <span
                            className="absolute left-2 right-2 top-0 h-0.5 rounded-full"
                            style={{
                              backgroundColor: "var(--accent)",
                            }}
                          />
                        )}

                        <span
                          className="flex h-4 items-center justify-center text-[11px] font-semibold"
                          style={{
                            color:
                              completed || current
                                ? "var(--accent)"
                                : "var(--muted)",
                          }}
                        >
                          {completed ? (
                            <Check
                              size={14}
                              strokeWidth={2.7}
                            />
                          ) : current ? (
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  "var(--accent)",
                              }}
                            />
                          ) : (
                            set.setNumber
                          )}
                        </span>

                        <span
                          className="mt-1 text-[17px] font-bold leading-none tracking-[-0.025em]"
                          style={{
                            color: current
                              ? "var(--accent)"
                              : completed
                                ? "var(--foreground)"
                                : "var(--muted)",
                          }}
                        >
                          {set.actualReps ??
                            set.targetReps}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom action */}
              <div
                className="flex min-h-[52px] items-center justify-between border-t px-4"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex min-w-0 items-center gap-2">
                  {isCompleted && (
                    <Check
                      size={15}
                      strokeWidth={2.5}
                      style={{
                        color: "var(--accent)",
                      }}
                    />
                  )}

                  {isInProgress && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          "var(--accent)",
                      }}
                    />
                  )}

                  <span
                    className="truncate text-[12px] font-semibold"
                    style={{
                      color: isInProgress
                        ? "var(--accent)"
                        : isCompleted
                          ? "var(--muted)"
                          : isCancelled
                            ? "#ef4444"
                            : "var(--muted)",
                    }}
                  >
                    {isCompleted
                      ? "Тренировка завершена"
                      : isInProgress
                        ? "Продолжить тренировку"
                        : isCancelled
                          ? "Тренировка отменена"
                          : "Начать тренировку"}
                  </span>
                </div>

                {!isCompleted && !isCancelled && (
                  <ChevronRight
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{
                      color: isInProgress
                        ? "var(--accent)"
                        : "var(--muted)",
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}