// app/workouts/[workoutId]/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";

import { getSessionUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";

import WorkoutSession from "@/app/components/WorkoutSession";
import StartWorkoutButton from "@/app/components/StartWorkoutButton";

type WorkoutPageProps = {
  params: Promise<{
    workoutId: string;
  }>;
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const { workoutId } = await params;

  const workout = await prisma.workout.findFirst({
    where: {
      id: workoutId,
      userId: user.id,
    },
    include: {
      exercise: true,
      trainingWeek: true,
      sets: {
        orderBy: {
          setNumber: "asc",
        },
      },
    },
  });

  if (!workout) {
    redirect("/training");
  }

  const statusLabel = {
    PLANNED: "Готова",
    IN_PROGRESS: "В процессе",
    COMPLETED: "Завершена",
    CANCELLED: "Отменена",
  }[workout.status];

  const isCompleted = workout.status === "COMPLETED";
  const isCancelled = workout.status === "CANCELLED";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
      <header className="pt-6 sm:pt-8">
        <p
          className="text-xs font-semibold uppercase tracking-[0.08em]"
          style={{
            color: "var(--muted)",
          }}
        >
          Неделя {workout.trainingWeek.weekNumber}
        </p>

        <div className="mt-1 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1
              className="text-[32px] font-bold leading-none tracking-[-0.05em] sm:text-[36px]"
              style={{
                color: "var(--foreground)",
              }}
            >
              Тренировка {workout.workoutNumber}
            </h1>

            <p
              className="mt-2 truncate text-base font-medium"
              style={{
                color: "var(--muted)",
              }}
            >
              {workout.exercise.name}
            </p>
          </div>

          <div
            className="shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold"
            style={{
              backgroundColor: isCompleted
                ? "color-mix(in srgb, var(--accent) 10%, transparent)"
                : isCancelled
                  ? "color-mix(in srgb, #ef4444 8%, transparent)"
                  : "var(--surface)",
              color: isCompleted
                ? "var(--accent)"
                : isCancelled
                  ? "#ef4444"
                  : "var(--muted)",
            }}
          >
            {statusLabel}
          </div>
        </div>
      </header>

      {workout.status === "PLANNED" && (
        <section className="mt-7">
          {/* HERO */}
          <div
            className="
        relative
        overflow-hidden
        rounded-[30px]
        border
        px-5
        py-6
      "
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <div
                  className="
              mb-3
              flex
              items-center
              gap-2
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.12em]
            "
                  style={{
                    color: "var(--accent)",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: "var(--accent)",
                    }}
                  />
                  Сегодня
                </div>

                <h2
                  className="
              text-[27px]
              font-bold
              leading-[1.05]
              tracking-[-0.045em]
            "
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  {workout.exercise.name}
                </h2>

                <p
                  className="mt-2 text-[14px]"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Тренировка готова
                </p>
              </div>

              {/* SET COUNT */}
              <div
                className="
            flex
            h-[76px]
            w-[76px]
            shrink-0
            flex-col
            items-center
            justify-center
            rounded-[24px]
          "
                style={{
                  backgroundColor: "var(--surface)",
                }}
              >
                <span
                  className="
              text-[28px]
              font-bold
              leading-none
              tracking-[-0.05em]
            "
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  {workout.sets.length}
                </span>

                <span
                  className="
              mt-1
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.08em]
            "
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  подходов
                </span>
              </div>
            </div>

            {/* META */}
            <div
              className="
          mt-6
          flex
          items-center
          justify-between
          border-t
          pt-4
        "
              style={{
                borderColor: "var(--border)",
              }}
            >
              <span
                className="text-xs font-medium"
                style={{
                  color: "var(--muted)",
                }}
              >
                Твой план на сегодня
              </span>

              <span
                className="text-xs font-semibold"
                style={{
                  color: "var(--foreground)",
                }}
              >
                {workout.sets.reduce((total, set) => total + set.targetReps, 0)}{" "}
                повторений
              </span>
            </div>
          </div>

          {/* PLAN */}
          <div className="mt-8">
            <div className="mb-4 flex items-end justify-between px-1">
              <div>
                <h3
                  className="
              text-[21px]
              font-bold
              leading-none
              tracking-[-0.04em]
            "
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  Подходы
                </h3>

                <p
                  className="mt-1.5 text-xs"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Выполняй последовательно
                </p>
              </div>

              <span
                className="text-xs font-medium"
                style={{
                  color: "var(--muted)",
                }}
              >
                {workout.sets.length} всего
              </span>
            </div>

            {/* SET LIST */}
            <div
              className="
          overflow-hidden
          rounded-[26px]
          border
        "
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              {workout.sets.map((set, index) => (
                <div
                  key={set.id}
                  className="
              flex
              items-center
              justify-between
              px-4
              py-4
            "
                  style={{
                    borderBottom:
                      index !== workout.sets.length - 1
                        ? "1px solid var(--border)"
                        : undefined,
                  }}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[14px]
                  text-sm
                  font-bold
                "
                      style={{
                        backgroundColor:
                          index === 0
                            ? "color-mix(in srgb, var(--accent) 11%, transparent)"
                            : "var(--surface)",
                        color: index === 0 ? "var(--accent)" : "var(--muted)",
                      }}
                    >
                      {set.setNumber}
                    </div>

                    <div>
                      <p
                        className="
                    text-[14px]
                    font-semibold
                    leading-none
                  "
                        style={{
                          color: "var(--foreground)",
                        }}
                      >
                        Подход {set.setNumber}
                      </p>

                      <p
                        className="mt-1.5 text-[11px]"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        Целевой объём
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span
                      className="
                  text-[26px]
                  font-bold
                  leading-none
                  tracking-[-0.045em]
                "
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      {set.targetReps}
                    </span>

                    <span
                      className="text-xs font-medium"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      раз
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTION */}
          <div className="mt-7">
            <p
              className="mb-3 px-1 text-xs leading-5"
              style={{
                color: "var(--muted)",
              }}
            >
              После каждого подхода приложение автоматически запустит отдых.
            </p>

            <StartWorkoutButton workoutId={workout.id} />
          </div>
        </section>
      )}

      {workout.status === "IN_PROGRESS" && (
        <section className="mt-5">
          <WorkoutSession workoutId={workout.id} sets={workout.sets} />
        </section>
      )}

      {workout.status === "COMPLETED" && (
        <section className="mt-7">
          <div
            className="rounded-[24px] border p-5"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent) 10%, transparent)",
                }}
              >
                <span
                  className="text-xl font-semibold"
                  style={{
                    color: "var(--accent)",
                  }}
                >
                  ✓
                </span>
              </div>

              <div className="min-w-0">
                <h2
                  className="text-lg font-bold tracking-[-0.025em]"
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  Тренировка завершена
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Все подходы выполнены.
                </p>
              </div>
            </div>

            <Link
              href="/training"
              className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl text-sm font-semibold text-white transition-transform active:scale-[0.98]"
              style={{
                backgroundColor: "var(--accent)",
              }}
            >
              К тренировкам
            </Link>
          </div>
        </section>
      )}

      {workout.status === "CANCELLED" && (
        <section className="mt-7">
          <div
            className="rounded-[24px] border p-5"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, #ef4444 8%, transparent)",
                }}
              >
                <span
                  className="text-xl font-semibold"
                  style={{
                    color: "#ef4444",
                  }}
                >
                  !
                </span>
              </div>

              <div className="min-w-0">
                <h2
                  className="text-lg font-bold tracking-[-0.025em]"
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  Тренировка отменена
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Эта тренировка больше недоступна.
                </p>
              </div>
            </div>

            <Link
              href="/training"
              className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl border text-sm font-semibold transition-transform active:scale-[0.98]"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              К тренировкам
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
