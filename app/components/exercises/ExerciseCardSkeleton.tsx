// app/components/exercises/ExerciseCardSkeleton.tsx
type ExerciseCardSkeletonProps = {
  /** Количество скелетонов карточек. */
  count?: number;
};

/**
 * Скелетон списка карточек упражнений.
 *
 * Используется во время загрузки данных, чтобы сохранить
 * структуру интерфейса и избежать резкого изменения layout.
 *
 * @param count Количество отображаемых скелетонов.
 * @returns Набор скелетонов карточек упражнений.
 */
export default function ExerciseCardSkeleton({
  count = 4,
}: ExerciseCardSkeletonProps) {
  return (
    <div
      className="space-y-3"
      aria-busy="true"
      aria-label="Загрузка упражнений"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="
            flex
            min-h-[124px]
            w-full
            overflow-hidden
            rounded-[26px]
            border
          "
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          {/* IMAGE */}
          <div
            className="
              w-[100px]
              shrink-0
              animate-pulse
              sm:w-[112px]
            "
            style={{
              backgroundColor: "var(--surface)",
            }}
          />

          {/* CONTENT */}
          <div className="flex min-w-0 flex-1 items-center">
            <div className="min-w-0 flex-1 px-4 py-4 sm:px-5">
              {/* TITLE */}
              <div
                className="
                  h-5
                  w-36
                  max-w-full
                  animate-pulse
                  rounded-full
                "
                style={{
                  backgroundColor: "var(--surface)",
                }}
              />

              {/* DESCRIPTION */}
              <div className="mt-3 space-y-2">
                <div
                  className="
                    h-3
                    w-full
                    max-w-[210px]
                    animate-pulse
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--surface)",
                  }}
                />

                <div
                  className="
                    h-3
                    w-32
                    animate-pulse
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--surface)",
                  }}
                />
              </div>

              {/* RECORD */}
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="
                    h-7
                    w-7
                    shrink-0
                    animate-pulse
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--surface)",
                  }}
                />

                <div className="space-y-1.5">
                  <div
                    className="
                      h-2
                      w-20
                      animate-pulse
                      rounded-full
                    "
                    style={{
                      backgroundColor: "var(--surface)",
                    }}
                  />

                  <div
                    className="
                      h-3
                      w-24
                      animate-pulse
                      rounded-full
                    "
                    style={{
                      backgroundColor: "var(--surface)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ACTION AREA */}
            <div
              className="
                flex
                h-full
                w-[40px]
                shrink-0
                items-center
                justify-center
                border-l
                sm:w-[48px]
              "
              style={{
                borderColor: "var(--border)",
              }}
            >
              <div
                className="
                  h-5
                  w-1
                  animate-pulse
                  rounded-full
                "
                style={{
                  backgroundColor: "var(--surface)",
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
