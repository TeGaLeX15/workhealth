// app/components/workout/PlannedWorkout.tsx
import StartWorkoutButton from "@/app/components/StartWorkoutButton";
import WorkoutPlan from "./WorkoutPlan";

type PlannedWorkoutProps = {
  workout: {
    id: string;
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

export default function PlannedWorkout({ workout }: PlannedWorkoutProps) {
  const totalReps = workout.sets.reduce(
    (total, set) => total + set.targetReps,
    0,
  );

  return (
    <section className="mt-7">
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
        <div className="flex items-center justify-between">
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

          <span
            className="
              rounded-full
              px-2.5
              py-1
              text-[10px]
              font-semibold
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent) 8%, transparent)",
              color: "var(--accent)",
            }}
          >
            Готова
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
            className="
              mt-2
              text-[13px]
              font-medium
            "
            style={{
              color: "var(--muted)",
            }}
          >
            Твой план на сегодня
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
              className="text-[12px] font-medium"
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
            className="text-[12px] font-medium"
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
        <StartWorkoutButton workoutId={workout.id} />

        <div className="mt-3 flex items-center justify-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--accent)",
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
