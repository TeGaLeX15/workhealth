// app/components/workout/CompletedWorkout.tsx
import Link from "next/link";

type CompletedWorkoutProps = {
  workout: {
    exercise: {
      name: string;
    };
    sets: {
      actualReps: number | null;
      targetReps: number;
    }[];
  };
};

export default function CompletedWorkout({ workout }: CompletedWorkoutProps) {
  const totalReps = workout.sets.reduce(
    (total, set) => total + (set.actualReps ?? set.targetReps),
    0,
  );

  return (
    <section className="mt-6">
      <div
        className="
          overflow-hidden
          rounded-[28px]
          border
          px-5
          py-7
          sm:px-7
          sm:py-8
        "
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        {/* SUCCESS */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex
              h-[72px]
              w-[72px]
              items-center
              justify-center
              rounded-full
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent) 11%, transparent)",
              boxShadow:
                "0 0 0 8px color-mix(in srgb, var(--accent) 4%, transparent)",
            }}
          >
            <span
              className="
                text-[30px]
                font-bold
                leading-none
              "
              style={{
                color: "var(--accent)",
              }}
            >
              ✓
            </span>
          </div>

          <p
            className="
              mt-5
              text-[11px]
              font-bold
              uppercase
              tracking-[0.14em]
            "
            style={{
              color: "var(--accent)",
            }}
          >
            Готово
          </p>

          <h2
            className="
              mt-1.5
              text-[27px]
              font-bold
              leading-none
              tracking-[-0.05em]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            Тренировка завершена
          </h2>

          <p
            className="
              mt-2
              text-[13px]
            "
            style={{
              color: "var(--muted)",
            }}
          >
            {workout.exercise.name}
          </p>
        </div>

        {/* SUMMARY */}
        <div
          className="
            mt-7
            grid
            grid-cols-2
            overflow-hidden
            rounded-[20px]
            border
          "
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {/* SETS */}
          <div className="px-4 py-4 text-center">
            <div
              className="
                text-[25px]
                font-bold
                leading-none
                tracking-[-0.05em]
                tabular-nums
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              {workout.sets.length}
            </div>

            <div
              className="
                mt-1.5
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
            </div>
          </div>

          {/* REPS */}
          <div
            className="
              border-l
              px-4
              py-4
              text-center
            "
            style={{
              borderColor: "var(--border)",
            }}
          >
            <div
              className="
                text-[25px]
                font-bold
                leading-none
                tracking-[-0.05em]
                tabular-nums
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              {totalReps}
            </div>

            <div
              className="
                mt-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]
              "
              style={{
                color: "var(--muted)",
              }}
            >
              повторений
            </div>
          </div>
        </div>

        {/* ACTION */}
        <Link
          href="/training"
          className="
            mt-4
            flex
            h-13
            w-full
            items-center
            justify-center
            rounded-[18px]
            text-[14px]
            font-semibold
            text-white
            transition-transform
            active:scale-[0.98]
          "
          style={{
            backgroundColor: "var(--accent)",
          }}
        >
          К тренировкам
        </Link>
      </div>
    </section>
  );
}
