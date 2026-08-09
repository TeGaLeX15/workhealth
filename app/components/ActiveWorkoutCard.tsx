"use client";

import Link from "next/link";
import {
  Check,
  ChevronRight,
  Dumbbell,
  Trophy,
} from "lucide-react";

type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
  completedAt: Date | null;
  workoutId: string;
};

type ActiveWorkoutCardProps = {
  workoutId: string;
  workoutNumber: number;
  sets: WorkoutSet[];
};

export default function ActiveWorkoutCard({
  workoutId,
  workoutNumber,
  sets,
}: ActiveWorkoutCardProps) {
  if (sets.length === 0) {
    return (
      <section
        className="
          rounded-[28px]
          border
          p-5
        "
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[16px]
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--muted) 8%, var(--surface))",
            }}
          >
            <Dumbbell
              size={19}
              strokeWidth={1.8}
              style={{
                color: "var(--muted)",
              }}
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
              "
              style={{
                color: "var(--muted)",
              }}
            >
              Тренировка {workoutNumber}
            </p>

            <p
              className="
                mt-1
                text-[15px]
                font-semibold
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              Нет подходов
            </p>
          </div>
        </div>
      </section>
    );
  }

  const completedSets = sets.filter(
    (set) => set.completed,
  ).length;

  const totalSets = sets.length;

  const currentSetIndex = sets.findIndex(
    (set) => !set.completed,
  );

  const currentSet =
    currentSetIndex >= 0
      ? sets[currentSetIndex]
      : null;

  const isCompleted =
    completedSets === totalSets;

  const progress =
    totalSets > 0
      ? Math.round(
          (completedSets / totalSets) * 100,
        )
      : 0;

  return (
    <section
      className="
        overflow-hidden
        rounded-[30px]
        border
        transition-all
        duration-300
      "
      style={{
        borderColor: isCompleted
          ? "color-mix(in srgb, var(--accent) 22%, var(--border))"
          : "color-mix(in srgb, var(--accent) 28%, var(--border))",

        backgroundColor: "var(--surface)",

        boxShadow: isCompleted
          ? "none"
          : "0 8px 30px color-mix(in srgb, var(--accent) 5%, transparent)",
      }}
    >
      {/* ══════════════════════════════
          HEADER
      ══════════════════════════════ */}

      <div className="px-5 pb-4 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-[15px]
              "
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent) 9%, var(--surface))",
              }}
            >
              {isCompleted ? (
                <Trophy
                  size={18}
                  strokeWidth={1.8}
                  style={{
                    color: "var(--accent)",
                  }}
                />
              ) : (
                <Dumbbell
                  size={18}
                  strokeWidth={1.8}
                  style={{
                    color: "var(--accent)",
                  }}
                />
              )}
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                "
                style={{
                  color: "var(--muted)",
                }}
              >
                Тренировка
              </p>

              <p
                className="
                  mt-0.5
                  text-[16px]
                  font-bold
                  tracking-[-0.02em]
                "
                style={{
                  color: "var(--foreground)",
                }}
              >
                {workoutNumber}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              h-9
              items-center
              rounded-full
              px-3
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent) 8%, var(--surface))",
            }}
          >
            <span
              className="
                text-[12px]
                font-semibold
              "
              style={{
                color: "var(--accent)",
              }}
            >
              {completedSets}
              <span
                style={{
                  color: "var(--muted)",
                }}
              >
                {" "}
                / {totalSets}
              </span>
            </span>
          </div>
        </div>

        {/* Progress */}

        <div className="mt-5">
          <div
            className="
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
                transition-[width]
                duration-700
                ease-out
              "
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--accent)",
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span
              className="text-[10px] font-medium"
              style={{
                color: "var(--muted)",
              }}
            >
              Прогресс тренировки
            </span>

            <span
              className="
                text-[10px]
                font-semibold
              "
              style={{
                color: "var(--accent)",
              }}
            >
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          SETS
      ══════════════════════════════ */}

      <div className="px-5 pb-5 pt-2">
        <div
          className="
            rounded-[22px]
            p-3
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--background) 45%, var(--surface))",
          }}
        >
          <div className="flex gap-2">
            {sets.map((set, index) => {
              const completed = set.completed;

              const current =
                !isCompleted &&
                index === currentSetIndex;

              return (
                <div
                  key={set.id}
                  className="
                    relative
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    rounded-[17px]
                    py-2.5
                    transition-all
                    duration-300
                  "
                  style={{
                    backgroundColor: current
                      ? "var(--surface)"
                      : completed
                        ? "color-mix(in srgb, var(--accent) 8%, var(--surface))"
                        : "transparent",

                    boxShadow: current
                      ? "0 2px 10px color-mix(in srgb, var(--foreground) 6%, transparent)"
                      : "none",
                  }}
                >
                  <div
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                    "
                    style={{
                      backgroundColor: completed
                        ? "var(--accent)"
                        : current
                          ? "color-mix(in srgb, var(--accent) 11%, var(--surface))"
                          : "color-mix(in srgb, var(--muted) 7%, var(--surface))",
                    }}
                  >
                    {completed ? (
                      <Check
                        size={12}
                        strokeWidth={3}
                        style={{
                          color: "white",
                        }}
                      />
                    ) : (
                      <span
                        className="
                          text-[9px]
                          font-bold
                        "
                        style={{
                          color: current
                            ? "var(--accent)"
                            : "var(--muted)",
                        }}
                      >
                        {set.setNumber}
                      </span>
                    )}
                  </div>

                  <span
                    className="
                      mt-1.5
                      text-[11px]
                      font-semibold
                    "
                    style={{
                      color: current
                        ? "var(--foreground)"
                        : completed
                          ? "var(--accent)"
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
      </div>

      {/* ══════════════════════════════
          CURRENT / COMPLETE
      ══════════════════════════════ */}

      <div className="px-5 pb-5">
        {isCompleted ? (
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
              className="
                mt-1
                text-[12px]
              "
              style={{
                color: "var(--muted)",
              }}
            >
              Все {totalSets} подходов выполнены
            </p>
          </div>
        ) : (
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
                      backgroundColor:
                        "var(--accent)",
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
                    className="
                      text-[13px]
                    "
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
                  backgroundColor:
                    "var(--surface)",
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
        )}
      </div>

      {/* ══════════════════════════════
          BUTTON
      ══════════════════════════════ */}

      <div className="px-5 pb-5">
        <Link
          href={`/workouts/${workoutId}`}
          className="
            group
            flex
            h-[52px]
            w-full
            items-center
            justify-between
            rounded-[18px]
            px-4
            transition-transform
            duration-200
            active:scale-[0.985]
          "
          style={{
            backgroundColor: isCompleted
              ? "color-mix(in srgb, var(--muted) 9%, var(--surface))"
              : "var(--accent)",

            color: isCompleted
              ? "var(--foreground)"
              : "white",
          }}
        >
          <span
            className="
              text-[13px]
              font-semibold
            "
          >
            {isCompleted
              ? "Посмотреть тренировку"
              : "Продолжить тренировку"}
          </span>

          <ChevronRight
            size={18}
            strokeWidth={2}
            className="
              transition-transform
              duration-200
              group-hover:translate-x-0.5
            "
          />
        </Link>
      </div>
    </section>
  );
}