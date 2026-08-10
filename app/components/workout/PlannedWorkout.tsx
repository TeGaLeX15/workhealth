// app/components/workout/PlannedWorkout.tsx
import { getSessionUser } from "@/app/server/auth/session";
import {
  getLocalDateString,
  getDateColumnString,
} from "@/app/lib/timezone/local-date";

import StartWorkoutButton from "@/app/components/StartWorkoutButton";
import WorkoutPlan from "./WorkoutPlan";

type PlannedWorkoutProps = {
  workout: {
    id: string;
    scheduledDate: Date;
    exercise: {
      name: string;
    };
    sets: {
      id: string;
      setNumber: number;
      targetReps: number;
    }[];
  };
};

function getDateLabel(
  date: Date,
  timeZone: string,
) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatter.format(date);
}

export default async function PlannedWorkout({
  workout,
}: PlannedWorkoutProps) {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  const totalReps = workout.sets.reduce(
    (total, set) => total + set.targetReps,
    0,
  );

  /*
   * Сегодня определяется относительно
   * timezone пользователя.
   *
   * Например:
   * America/Aruba → 2026-08-10
   * Australia/Perth → 2026-08-11
   */
  const todayString = getLocalDateString(
    new Date(),
    user.timezone,
  );

  /*
   * scheduledDate — Prisma @db.Date.
   *
   * Это календарная дата, поэтому НЕ пропускаем
   * её через timezone пользователя.
   *
   * Например:
   * 2026-08-10T00:00:00.000Z
   * → "2026-08-10"
   */
  const scheduledDateString =
    getDateColumnString(workout.scheduledDate);

  const isToday =
    scheduledDateString === todayString;

  const dateLabel = isToday
    ? "Сегодня"
    : getDateLabel(
        workout.scheduledDate,
        "UTC",
      );

  const subtitle = isToday
    ? "Твой план на сегодня"
    : "Следующая тренировка";

  const canStart = isToday;

  return (
    <section>
      {/* HERO */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          px-5
          py-5
          sm:px-6
          sm:py-6
        "
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        {/* TOP */}
        <div
          className="
            flex
            items-center
            gap-2
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
          "
          style={{
            color: canStart
              ? "var(--accent)"
              : "var(--muted)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: canStart
                ? "var(--accent)"
                : "var(--muted)",
            }}
          />

          <span>{dateLabel}</span>

          <span
            className="
              rounded-full
              px-2.5
              py-1
              text-[10px]
              font-semibold
              normal-case
              tracking-normal
            "
            style={{
              backgroundColor: canStart
                ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                : "color-mix(in srgb, var(--muted) 8%, transparent)",
              color: canStart
                ? "var(--accent)"
                : "var(--muted)",
            }}
          >
            {canStart
              ? "Готова"
              : "Запланирована"}
          </span>
        </div>

        {/* EXERCISE */}
        <div className="mt-5">
          <h2
            className="
              text-[29px]
              font-bold
              leading-[1]
              tracking-[-0.05em]
              sm:text-[32px]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {workout.exercise.name}
          </h2>

          <p
            className="mt-2 text-[13px] font-medium"
            style={{
              color: "var(--muted)",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* MAIN METRIC */}
        <div className="mt-7">
          <div className="flex items-end gap-2">
            <span
              className="
                text-[64px]
                font-bold
                leading-[0.82]
                tracking-[-0.075em]
                tabular-nums
                sm:text-[72px]
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              {totalReps}
            </span>

            <span
              className="
                mb-1
                text-[13px]
                font-semibold
                leading-none
              "
              style={{
                color: "var(--muted)",
              }}
            >
              повторений
            </span>
          </div>
        </div>

        {/* SUMMARY */}
        <div
          className="
            mt-6
            flex
            items-center
            gap-3
            border-t
            pt-4
          "
          style={{
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="
                text-[14px]
                font-bold
                tabular-nums
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              {workout.sets.length}
            </span>

            <span
              className="
                text-[12px]
                font-medium
              "
              style={{
                color: "var(--muted)",
              }}
            >
              подходов
            </span>
          </div>

          <span
            className="h-1 w-1 rounded-full"
            style={{
              backgroundColor: "var(--border)",
            }}
          />

          <span
            className="
              text-[12px]
              font-medium
            "
            style={{
              color: "var(--muted)",
            }}
          >
            Выполняй последовательно
          </span>
        </div>
      </div>

      {/* PLAN */}
      <WorkoutPlan sets={workout.sets} />

      {/* ACTION */}
      <div className="mt-5">
        {canStart ? (
          <StartWorkoutButton
            workoutId={workout.id}
          />
        ) : (
          <div
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              rounded-2xl
              text-[15px]
              font-semibold
            "
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--muted)",
            }}
          >
            Тренировка ещё не наступила
          </div>
        )}

        <div
          className="
            mt-3
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: canStart
                ? "var(--accent)"
                : "var(--muted)",
            }}
          />

          <span
            className="
              text-[11px]
              font-medium
            "
            style={{
              color: "var(--muted)",
            }}
          >
            После каждого подхода — отдых 30 сек
          </span>
        </div>
      </div>
    </section>
  );
}
