// app/components/workout/WorkoutPlan.tsx
type WorkoutPlanProps = {
  sets: {
    id: string;
    setNumber: number;
    targetReps: number;
  }[];
};

const REST_SECONDS = 60;

export default function WorkoutPlan({ sets }: WorkoutPlanProps) {
  return (
    <section className="mt-7">
      {/* HEADER */}
      <div className="mb-3 px-1">
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
          План
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
          5 подходов · отдых между подходами
        </p>
      </div>

      {/* SET PLAN */}
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
        <div className="grid grid-cols-5">
          {sets.map((set, index) => {
            const isLast = index === sets.length - 1;

            return (
              <div
                key={set.id}
                className="
                  relative
                  flex
                  min-w-0
                  flex-col
                  items-center
                  justify-center
                  px-1
                  py-5
                "
              >
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      right-0
                      top-1/2
                      h-8
                      w-px
                      -translate-y-1/2
                    "
                    style={{
                      backgroundColor: "var(--border)",
                    }}
                  />
                )}
                
                <div className="flex w-full items-center gap-1.5">
                  <span
                    className="h-px flex-1"
                    style={{ backgroundColor: "var(--border)" }}
                  />

                  <span
                    className="text-[9px] font-bold tabular-nums"
                    style={{ color: "var(--muted)" }}
                  >
                    {set.setNumber}
                  </span>

                  <span
                    className="h-px flex-1"
                    style={{ backgroundColor: "var(--border)" }}
                  />
                </div>

              <span
                className="
                  mt-2
                  text-[30px]
                  font-bold
                  leading-none
                  tracking-[-0.07em]
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
                    mt-1
                    text-[9px]
                    font-medium
                    leading-none
                  "
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  повторений
                </span>
              </div>
            );
          })}
        </div>

        {/* REST */}
        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            border-t
            px-4
            py-3
          "
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--accent)",
            }}
            aria-hidden="true"
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
            Отдых
          </span>

          <span
            className="
              text-[12px]
              font-bold
              tabular-nums
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {REST_SECONDS} сек
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
            между подходами
          </span>
        </div>
      </div>
    </section>
  );
}
