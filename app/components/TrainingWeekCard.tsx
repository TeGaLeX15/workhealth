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

    default:
      return "";
  }
}

function getStatusStyle(status: Workout["status"]) {
  switch (status) {
    case "PLANNED":
      return {
        backgroundColor:
          "color-mix(in srgb, var(--muted) 10%, var(--surface))",
        color: "var(--muted)",
      };

    case "IN_PROGRESS":
      return {
        backgroundColor:
          "color-mix(in srgb, var(--accent) 12%, var(--surface))",
        color: "var(--accent)",
      };

    case "COMPLETED":
      return {
        backgroundColor:
          "color-mix(in srgb, var(--accent) 15%, var(--surface))",
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
        backgroundColor: "var(--surface)",
        color: "var(--muted)",
      };
  }
}

function getCardStyle(status: Workout["status"]) {
  switch (status) {
    case "IN_PROGRESS":
      return {
        borderColor:
          "color-mix(in srgb, var(--accent) 42%, var(--border))",

        backgroundColor:
          "color-mix(in srgb, var(--accent) 3%, var(--surface))",

        boxShadow:
          "0 0 0 1px color-mix(in srgb, var(--accent) 7%, transparent), 0 8px 24px color-mix(in srgb, var(--accent) 7%, transparent)",
      };

    case "COMPLETED":
      return {
        borderColor:
          "color-mix(in srgb, var(--accent) 20%, var(--border))",

        backgroundColor:
          "color-mix(in srgb, var(--accent) 1.5%, var(--surface))",

        boxShadow: "none",
      };

    case "CANCELLED":
      return {
        borderColor:
          "color-mix(in srgb, #ef4444 18%, var(--border))",

        backgroundColor:
          "color-mix(in srgb, #ef4444 1.5%, var(--surface))",

        boxShadow: "none",
      };

    case "PLANNED":
    default:
      return {
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
        boxShadow: "none",
      };
  }
}

export default function TrainingWeekCard({
  weekNumber,
  workouts,
}: TrainingWeekCardProps) {
  return (
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

        const isPlanned = workout.status === "PLANNED";
        const isInProgress = workout.status === "IN_PROGRESS";
        const isCompleted = workout.status === "COMPLETED";
        const isCancelled = workout.status === "CANCELLED";

        const currentSetIndex = workout.sets.findIndex(
          (set) => !set.completed,
        );

        return (
          <Link
            key={workout.id}
            href={`/workouts/${workout.id}`}
            className={`
              group
              relative
              block
              overflow-hidden
              rounded-[24px]
              border
              transition-all
              duration-300
              active:scale-[0.985]
              ${
                isInProgress
                  ? "bodyos-active-workout"
                  : ""
              }
              ${
                isCancelled
                  ? "opacity-[0.72]"
                  : ""
              }
            `}
            style={getCardStyle(workout.status)}
          >
            {/* ─────────────────────────────
                Индикатор активной тренировки
            ───────────────────────────── */}
            {isInProgress && (
              <div
                className="
                  bodyos-workout-indicator
                  h-0.5
                  w-full
                "
                style={{
                  backgroundColor: "var(--accent)",
                }}
              />
            )}

            {/* ─────────────────────────────
                Основная информация
            ───────────────────────────── */}
            <div className="px-4 pb-4 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.13em]
                    "
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    Неделя {weekNumber}
                  </p>

                  <h3
                    className="
                      mt-1
                      text-[18px]
                      font-bold
                      leading-tight
                      tracking-[-0.025em]
                    "
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    Тренировка {workout.workoutNumber}
                  </h3>
                </div>

                {/* Статус */}
                <span
                  className="
                    shrink-0
                    whitespace-nowrap
                    rounded-full
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-semibold
                    leading-none
                  "
                  style={getStatusStyle(workout.status)}
                >
                  {getStatusLabel(workout.status)}
                </span>
              </div>

              {/* ─────────────────────────────
                  Прогресс
              ───────────────────────────── */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className="
                        text-[15px]
                        font-semibold
                        tracking-[-0.01em]
                      "
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      {completedSets}
                    </span>

                    <span
                      className="ml-1 text-[13px]"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      из {totalSets} подходов
                    </span>
                  </div>

                  {isInProgress && (
                    <span
                      className="
                        text-[11px]
                        font-semibold
                      "
                      style={{
                        color: "var(--accent)",
                      }}
                    >
                      {progress}%
                    </span>
                  )}
                </div>

                <div
                  className="mt-2.5 h-1 overflow-hidden rounded-full"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--muted) 10%, var(--background))",
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

            {/* ─────────────────────────────
                Подходы
            ───────────────────────────── */}
            <div
              className="border-t px-4 py-3.5"
              style={{
                borderColor: "var(--border)",
                backgroundColor:
                  "color-mix(in srgb, var(--background) 45%, var(--surface))",
              }}
            >
              <div
                className="grid w-full gap-1.5"
                style={{
                  gridTemplateColumns: `repeat(${Math.max(
                    workout.sets.length,
                    1,
                  )}, minmax(0, 1fr))`,
                }}
              >
                {workout.sets.map((set, index) => {
                  const isSetCompleted = set.completed;

                  const isCurrent =
                    isInProgress &&
                    currentSetIndex !== -1 &&
                    index === currentSetIndex;

                  const isUpcoming =
                    !isSetCompleted && !isCurrent;

                  return (
                    <div
                      key={set.id}
                      className={`
                        relative
                        flex
                        min-w-0
                        min-h-[64px]
                        flex-col
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-2xl
                        border
                        transition-all
                        duration-300
                        ${
                          isCurrent
                            ? "bodyos-current-set"
                            : ""
                        }
                      `}
                      style={{
                        ...(isSetCompleted
                          ? {
                              borderColor:
                                "color-mix(in srgb, var(--accent) 25%, var(--border))",
                              backgroundColor:
                                "color-mix(in srgb, var(--accent) 9%, var(--surface))",
                            }
                          : isCurrent
                            ? {
                                borderColor:
                                  "color-mix(in srgb, var(--accent) 60%, var(--border))",
                                backgroundColor:
                                  "color-mix(in srgb, var(--accent) 16%, var(--surface))",
                              }
                            : {
                                borderColor:
                                  "color-mix(in srgb, var(--border) 55%, transparent)",
                                backgroundColor:
                                  "color-mix(in srgb, var(--background) 35%, var(--surface))",
                              }),

                        opacity: isUpcoming ? 0.58 : 1,
                      }}
                    >
                      {/* Верхний индикатор текущего подхода */}
                      {isCurrent && (
                        <div
                          className="
                            bodyos-current-indicator
                            absolute
                            left-2
                            right-2
                            top-0
                            h-0.5
                            rounded-full
                          "
                          style={{
                            backgroundColor: "var(--accent)",
                          }}
                        />
                      )}

                      {/* Состояние */}
                      <span
                        className="
                          flex
                          h-4
                          items-center
                          justify-center
                          text-[12px]
                          font-semibold
                          leading-none
                        "
                        style={{
                          color: isSetCompleted
                            ? "var(--accent)"
                            : isCurrent
                              ? "var(--accent)"
                              : "var(--muted)",
                        }}
                      >
                        {isSetCompleted ? (
                          <Check
                            size={14}
                            strokeWidth={2.7}
                          />
                        ) : isCurrent ? (
                          <span
                            className="
                              bodyos-current-dot
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

                      {/* Повторения */}
                      <span
                        className="
                          mt-1
                          text-[17px]
                          font-bold
                          leading-none
                          tracking-[-0.025em]
                        "
                        style={{
                          color: isCurrent
                            ? "var(--accent)"
                            : isSetCompleted
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

              {/* Легенда активной тренировки */}
              {isInProgress && (
                <div className="mt-3 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Check
                      size={11}
                      strokeWidth={2.5}
                      style={{
                        color: "var(--accent)",
                      }}
                    />

                    <span
                      className="text-[10px]"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      выполнено
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          "var(--accent)",
                      }}
                    />

                    <span
                      className="text-[10px]"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      сейчас
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ─────────────────────────────
                Действие
            ───────────────────────────── */}
            <div
              className="
                flex
                min-h-[50px]
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
                    strokeWidth={2.4}
                    style={{
                      color: "var(--accent)",
                    }}
                  />
                )}

                {isInProgress && (
                  <span
                    className="
                      bodyos-action-dot
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
                  className="text-[12px] font-medium"
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
                  size={17}
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
  );
}