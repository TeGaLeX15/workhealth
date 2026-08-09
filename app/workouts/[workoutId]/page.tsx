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

export default async function WorkoutPage({
  params,
}: WorkoutPageProps) {
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
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

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

      {/* ------------------------------------------------------------------ */}
      {/* Planned                                                            */}
      {/* ------------------------------------------------------------------ */}

      {workout.status === "PLANNED" && (
        <section className="mt-7">
          {/* Summary */}

          <div
            className="rounded-[24px] border p-5"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p
                  className="text-xs font-medium"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Сегодня
                </p>

                <p
                  className="mt-1 truncate text-lg font-bold tracking-[-0.025em]"
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  {workout.exercise.name}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p
                  className="text-xs font-medium"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Подходов
                </p>

                <p
                  className="mt-1 text-lg font-bold"
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  {workout.sets.length}
                </p>
              </div>
            </div>
          </div>

          {/* Sets */}

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2
                className="text-sm font-semibold"
                style={{
                  color: "var(--foreground)",
                }}
              >
                План тренировки
              </h2>

              <span
                className="text-xs"
                style={{
                  color: "var(--muted)",
                }}
              >
                {workout.sets.length} подхода
              </span>
            </div>

            <div className="space-y-2.5">
              {workout.sets.map((set) => (
                <div
                  key={set.id}
                  className="flex items-center justify-between rounded-[20px] border px-4 py-3.5"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                      style={{
                        backgroundColor: "var(--surface)",
                        color: "var(--muted)",
                      }}
                    >
                      {set.setNumber}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: "var(--foreground)",
                        }}
                      >
                        Подход {set.setNumber}
                      </p>

                      <p
                        className="mt-0.5 text-xs"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        Целевой результат
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 flex shrink-0 items-baseline gap-1">
                    <span
                      className="text-xl font-bold tracking-[-0.03em]"
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

          {/* Info */}

          <div
            className="mt-5 rounded-[20px] border px-4 py-3.5"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-xs leading-5"
              style={{
                color: "var(--muted)",
              }}
            >
              Выполняй подходы по порядку. После каждого
              подхода приложение запустит время отдыха.
            </p>
          </div>

          {/* Start */}

          <div className="mt-5">
            <StartWorkoutButton workoutId={workout.id} />
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* In progress                                                        */}
      {/* ------------------------------------------------------------------ */}

      {workout.status === "IN_PROGRESS" && (
        <section className="mt-5">
          <WorkoutSession
            workoutId={workout.id}
            sets={workout.sets}
          />
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Completed                                                          */}
      {/* ------------------------------------------------------------------ */}

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

      {/* ------------------------------------------------------------------ */}
      {/* Cancelled                                                          */}
      {/* ------------------------------------------------------------------ */}

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

