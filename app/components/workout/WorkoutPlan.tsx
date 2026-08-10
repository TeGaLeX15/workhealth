// app/components/workout/WorkoutPlan.tsx
type WorkoutPlanProps = {
  sets: {
    id: string;
    setNumber: number;
    targetReps: number;
  }[];
};

export default function WorkoutPlan({ sets }: WorkoutPlanProps) {
  const totalReps = sets.reduce((total, set) => total + set.targetReps, 0);

  return (
    <div className="mt-6">
      {/* HEADER */}
      <div className="mb-3 flex items-end justify-between px-1">
        <div>
          <h3
            className="
              text-[20px]
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
            className="
              mt-1.5
              text-[11px]
              font-medium
            "
            style={{
              color: "var(--muted)",
            }}
          >
            План тренировки
          </p>
        </div>

        <div className="flex items-baseline gap-1">
          <span
            className="
              text-[18px]
              font-bold
              leading-none
              tabular-nums
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {totalReps}
          </span>

          <span
            className="
              text-[10px]
              font-medium
            "
            style={{
              color: "var(--muted)",
            }}
          >
            повторений
          </span>
        </div>
      </div>

      {/* SET LIST */}
      <div
        className="
          overflow-hidden
          rounded-[24px]
          border
        "
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        {sets.map((set, index) => {
          const isFirst = index === 0;
          const isLast = index === sets.length - 1;

          return (
            <div
              key={set.id}
              className="
                flex
                min-h-[64px]
                items-center
                justify-between
                px-4
                py-3
              "
              style={{
                borderBottom: !isLast ? "1px solid var(--border)" : undefined,
              }}
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-[10px]
                    text-[12px]
                    font-bold
                    tabular-nums
                  "
                  style={{
                    backgroundColor: isFirst
                      ? "color-mix(in srgb, var(--accent) 11%, transparent)"
                      : "var(--surface)",
                    color: isFirst ? "var(--accent)" : "var(--muted)",
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
                    className="
                      mt-1.5
                      text-[10px]
                      font-medium
                    "
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    Целевой объём
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-baseline gap-1.5">
                <span
                  className="
                    text-[27px]
                    font-bold
                    leading-none
                    tracking-[-0.055em]
                    tabular-nums
                  "
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  {set.targetReps}
                </span>

                <span
                  className="
                    text-[11px]
                    font-medium
                  "
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  раз
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
