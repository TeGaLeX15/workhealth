// app/components/TrainingWeekCard.tsx
import Link from "next/link";
import { Check, ChevronRight, Lock } from "lucide-react";

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
  scheduledDate: Date;
  status:
    | "PLANNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "SKIPPED";
  sets: WorkoutSet[];
};

type TrainingWeekCardProps = {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  workouts: Workout[];
  currentWorkoutId: string | null;
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

    case "SKIPPED":
      return "Пропущена";
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

    case "SKIPPED":
      return {
        backgroundColor:
          "color-mix(in srgb, var(--muted) 8%, var(--surface))",
        color: "var(--muted)",
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

function formatDateRange(startDate: Date, endDate: Date) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return `${formatter.format(startDate)} — ${formatter.format(endDate)}`;
}

function formatWorkoutDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return formatter.format(date).replace(/\.$/, "");
}

function getTotalReps(sets: WorkoutSet[]) {
  return sets.reduce(
    (total, set) => total + set.targetReps,
    0,
  );
}

export default function TrainingWeekCard({
  weekNumber,
  startDate,
  endDate,
  workouts,
  currentWorkoutId,
}: TrainingWeekCardProps) {
  return (
    <section>
      {/* WEEK HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{
              color: "var(--accent)",
            }}
          >
            Тренировочная неделя
          </p>

          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h3
              className="text-[20px] font-bold tracking-[-0.035em]"
              style={{
                color: "var(--foreground)",
              }}
            >
              Неделя {weekNumber}
            </h3>

            <span
              className="text-[12px] font-medium"
              style={{
                color: "var(--muted)",
              }}
            >
              {formatDateRange(startDate, endDate)}
            </span>
          </div>
        </div>

        <span
          className="
            shrink-0
            rounded-full
            px-3
            py-1.5
            text-[11px]
            font-semibold
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--muted) 7%, var(--surface))",
            color: "var(--muted)",
          }}
        >
          {workouts.length}{" "}
          {workouts.length === 1
            ? "тренировка"
            : workouts.length >= 2 && workouts.length <= 4
              ? "тренировки"
              : "тренировок"}
        </span>
      </div>

      {/* WORKOUTS */}
      <div className="mt-4 space-y-3">
        {workouts.map((workout) => {
          const isInProgress =
            workout.status === "IN_PROGRESS";

          const isCompleted =
            workout.status === "COMPLETED";

          const isCancelled =
            workout.status === "CANCELLED";

          const isSkipped =
            workout.status === "SKIPPED";

          const isCurrent =
            workout.id === currentWorkoutId;

          const isFuture =
            workout.status === "PLANNED" && !isCurrent;

          /*
           * SKIPPED
           */
          if (isSkipped) {
            return (
              <div
                key={workout.id}
                className="
                  flex
                  min-h-[58px]
                  items-center
                  justify-between
                  gap-3
                  rounded-[18px]
                  border
                  px-4
                  py-3
                  opacity-60
                "
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--muted) 2%, var(--card))",
                  borderColor:
                    "color-mix(in srgb, var(--muted) 14%, var(--border))",
                }}
              >
                <div className="min-w-0">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.1em]
                    "
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    {formatWorkoutDate(workout.scheduledDate)}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[14px]
                      font-semibold
                      tracking-[-0.02em]
                    "
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    Тренировка #{workout.workoutNumber}
                  </p>
                </div>

                <span
                  className="
                    shrink-0
                    rounded-full
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-semibold
                  "
                  style={getStatusStyle("SKIPPED")}
                >
                  Пропущена
                </span>
              </div>
            );
          }

          /*
           * FUTURE
           *
           * Будущая тренировка:
           * - нельзя открыть
           * - есть дата
           * - есть количество подходов
           * - есть общий объём
           */
          if (isFuture) {
            const totalReps = getTotalReps(workout.sets);

            return (
              <div
                key={workout.id}
                className="
                  rounded-[20px]
                  border
                  px-4
                  py-3.5
                "
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--muted) 2%, var(--card))",
                  borderColor:
                    "color-mix(in srgb, var(--muted) 10%, var(--border))",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                      "
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      {formatWorkoutDate(workout.scheduledDate)}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[15px]
                        font-bold
                        tracking-[-0.02em]
                      "
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      Тренировка #{workout.workoutNumber}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className="
                        rounded-full
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-semibold
                      "
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--muted) 7%, var(--surface))",
                        color: "var(--muted)",
                      }}
                    >
                      Запланирована
                    </span>

                    <Lock
                      size={15}
                      strokeWidth={2}
                      style={{
                        color: "var(--muted)",
                      }}
                    />
                  </div>
                </div>

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-[11px]
                    font-medium
                  "
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  <span>
                    {workout.sets.length}{" "}
                    {workout.sets.length === 1
                      ? "подход"
                      : workout.sets.length >= 2 &&
                          workout.sets.length <= 4
                        ? "подхода"
                        : "подходов"}
                  </span>

                  <span
                    className="h-1 w-1 rounded-full"
                    style={{
                      backgroundColor: "var(--border)",
                    }}
                  />

                  <span>{totalReps} повторений</span>
                </div>
              </div>
            );
          }

          /*
           * ACTIVE / COMPLETED / CANCELLED
           */

          const completedSets = workout.sets.filter(
            (set) => set.completed,
          ).length;

          const totalSets = workout.sets.length;

          const progress =
            totalSets > 0
              ? Math.round(
                  (completedSets / totalSets) * 100,
                )
              : 0;

          const currentSetIndex =
            workout.sets.findIndex(
              (set) => !set.completed,
            );

          const workoutDate = formatWorkoutDate(
            workout.scheduledDate,
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
                isCancelled ? "opacity-60" : "",
              ].join(" ")}
              style={getWorkoutCardStyle(
                workout.status,
              )}
            >
              {/* ACTIVE INDICATOR */}
              {isInProgress && (
                <div
                  className="h-1 w-full"
                  style={{
                    backgroundColor: "var(--accent)",
                  }}
                />
              )}

              {/* HEADER */}
              <div className="px-4 pb-3 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                      "
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      {workoutDate}
                    </p>

                    <h4
                      className="
                        mt-1
                        text-[19px]
                        font-bold
                        leading-tight
                        tracking-[-0.03em]
                      "
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      Тренировка #{workout.workoutNumber}
                    </h4>
                  </div>

                  <span
                    className="
                      shrink-0
                      rounded-full
                      px-2.5
                      py-1.5
                      text-[10px]
                      font-semibold
                      leading-none
                    "
                    style={getStatusStyle(
                      workout.status,
                    )}
                  >
                    {getStatusLabel(workout.status)}
                  </span>
                </div>

                {/* PROGRESS */}
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
                    className="
                      mt-2
                      h-1.5
                      overflow-hidden
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--muted) 9%, var(--background))",
                    }}
                  >
                    <div
                      className="
                        h-full
                        rounded-full
                        transition-all
                        duration-500
                      "
                      style={{
                        width: `${progress}%`,
                        backgroundColor: "var(--accent)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SETS */}
              <div
                className="
                  border-t
                  px-4
                  py-3.5
                "
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
                        className="
                          relative
                          flex
                          min-h-[64px]
                          min-w-0
                          flex-col
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-[16px]
                          border
                        "
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
                            className="
                              absolute
                              left-2
                              right-2
                              top-0
                              h-0.5
                              rounded-full
                            "
                            style={{
                              backgroundColor:
                                "var(--accent)",
                            }}
                          />
                        )}

                        <span
                          className="
                            flex
                            h-4
                            items-center
                            justify-center
                            text-[11px]
                            font-semibold
                          "
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
                              className="
                                h-2.5
                                w-2.5
                                rounded-full
                              "
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
                          className="
                            mt-1
                            text-[17px]
                            font-bold
                            leading-none
                            tracking-[-0.025em]
                          "
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

              {/* BOTTOM ACTION */}
              <div
                className="
                  flex
                  min-h-[52px]
                  items-center
                  justify-between
                  border-t
                  px-4
                "
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
                      className="
                        h-2
                        w-2
                        shrink-0
                        rounded-full
                      "
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

                {!isCompleted &&
                  !isCancelled && (
                    <ChevronRight
                      size={18}
                      strokeWidth={1.8}
                      className="
                        shrink-0
                        transition-transform
                        duration-200
                        group-hover:translate-x-0.5
                      "
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