// app/components/workout/CancelledWorkout.tsx
import Link from "next/link";

type CancelledWorkoutProps = {
  workout: {
    exercise: {
      name: string;
    };
  };
};

export default function CancelledWorkout({ workout }: CancelledWorkoutProps) {
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
        {/* STATUS */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex
              h-[68px]
              w-[68px]
              items-center
              justify-center
              rounded-full
            "
            style={{
              backgroundColor: "color-mix(in srgb, #ef4444 8%, transparent)",
              boxShadow:
                "0 0 0 8px color-mix(in srgb, #ef4444 3%, transparent)",
            }}
          >
            <span
              className="
                text-[28px]
                font-semibold
                leading-none
              "
              style={{
                color: "#ef4444",
              }}
            >
              ×
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
              color: "#ef4444",
            }}
          >
            Недоступно
          </p>

          <h2
            className="
              mt-1.5
              text-[26px]
              font-bold
              leading-none
              tracking-[-0.05em]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            Тренировка отменена
          </h2>

          <p
            className="
              mt-2
              max-w-[280px]
              text-[13px]
              leading-5
            "
            style={{
              color: "var(--muted)",
            }}
          >
            Эта тренировка больше недоступна для выполнения.
          </p>
        </div>

        {/* INFO */}
        <div
          className="
            mt-7
            rounded-[20px]
            border
            px-4
            py-3.5
          "
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <span
              className="
                text-[12px]
                font-medium
              "
              style={{
                color: "var(--muted)",
              }}
            >
              Упражнение
            </span>

            <span
              className="
                truncate
                text-[13px]
                font-semibold
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              {workout.exercise.name}
            </span>
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
            border
            text-[14px]
            font-semibold
            transition-transform
            active:scale-[0.98]
          "
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
  );
}
