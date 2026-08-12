// app/components/workout/PlannedWorkout.tsx
import {
  getLocalDateString,
  getDateColumnString,
} from "@/app/lib/timezone/local-date";

import StartWorkoutButton from "@/app/components/workout/StartWorkoutButton";
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
  timeZone: string;
};

function getDateLabel(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatter.format(date);
}

export default function PlannedWorkout({
  workout,
  timeZone,
}: PlannedWorkoutProps) {
  const totalReps = workout.sets.reduce(
    (total, set) => total + set.targetReps,
    0,
  );

  // scheduledDate is a calendar date from Prisma @db.Date.
  // Do not convert it through the user's timezone.
  const scheduledDateString = getDateColumnString(workout.scheduledDate);

  // Determine today's date in the user's timezone.
  const todayString = getLocalDateString(new Date(), timeZone);

  const isToday = scheduledDateString === todayString;

  const dateLabel = isToday
    ? "Сегодня"
    : getDateLabel(workout.scheduledDate, "UTC");

  const subtitle = isToday ? "Твой план на сегодня" : "Следующая тренировка";

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
        <div className="flex items-center justify-between gap-3">
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
            "
            style={{
              color: canStart ? "var(--accent)" : "var(--muted)",
            }}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                backgroundColor: canStart ? "var(--accent)" : "var(--muted)",
              }}
            />

            <span>{dateLabel}</span>
          </div>

          <span
            className="
              shrink-0
              rounded-full
              px-2.5
              py-1
              text-[10px]
              font-semibold
            "
            style={{
              backgroundColor: canStart
                ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                : "color-mix(in srgb, var(--muted) 8%, transparent)",
              color: canStart ? "var(--accent)" : "var(--muted)",
            }}
          >
            {canStart ? "Готова" : "Запланирована"}
          </span>
        </div>

        {/* EXERCISE + SUBTITLE */}
        <div className="mt-4">
          <h2
            className="
              text-[30px]
              font-bold
              leading-[0.95]
              tracking-[-0.055em]
              sm:text-[34px]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {workout.exercise.name}
          </h2>

          <p
            className="
              mt-1.5
              text-[12px]
              font-medium
            "
            style={{
              color: "var(--muted)",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* MAIN METRIC */}
        <div
          className="
            mt-6
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div className="flex min-w-0 items-end gap-2">
            <span
              className="
                text-[68px]
                font-bold
                leading-[0.78]
                tracking-[-0.08em]
                tabular-nums
                sm:text-[76px]
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
                text-[12px]
                font-semibold
                leading-none
              "
              style={{
                color: "var(--accent)",
              }}
            >
              повторений
            </span>
          </div>

          {/* SET COUNT */}
          <div
            className="
              mb-0.5
              flex
              shrink-0
              flex-col
              items-end
            "
          >
            <span
              className="
                text-[22px]
                font-bold
                leading-none
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
                mt-1
                text-[10px]
                font-medium
                leading-none
              "
              style={{
                color: "var(--muted)",
              }}
            >
              подходов
            </span>
          </div>
        </div>

        {/* DIVIDER */}
        <div
          className="mt-5 h-px w-full"
          style={{
            backgroundColor: "var(--border)",
          }}
        />

        {/* FOOTER */}
        <div
          className="
            mt-3
            flex
            items-center
            gap-2
          "
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              backgroundColor: canStart ? "var(--accent)" : "var(--muted)",
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
            Выполняй последовательно
          </span>
        </div>
      </div>

      {/* PLAN */}
      <WorkoutPlan sets={workout.sets} />

      {/* ACTION */}
      <div className="mt-5">
        {canStart ? (
          <StartWorkoutButton workoutId={workout.id} />
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
      </div>
    </section>
  );
}
