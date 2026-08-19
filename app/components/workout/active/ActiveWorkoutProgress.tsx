// app/components/workout/active/ActiveWorkoutProgress.tsx

/**
 * Пропсы компонента прогресса активной тренировки.
 */
type ActiveWorkoutProgressProps = {
  /**
   * Процент выполнения тренировки.
   *
   * Ожидается значение в диапазоне от `0` до `100`.
   */
  progress: number;
};

/**
 * Отображает индикатор прогресса текущей тренировки
 * и процент её выполнения.
 *
 * @param props Пропсы компонента.
 * @param props.progress Текущий процент выполнения тренировки.
 * @returns Разметка индикатора прогресса.
 */
export default function ActiveWorkoutProgress({
  progress,
}: ActiveWorkoutProgressProps) {
  return (
    <div className="px-5 pb-4">
      <div className="mt-1">
        <div
          className="
            h-1.5
            overflow-hidden
            rounded-full
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--muted) 9%, var(--background))",
          }}
        >
          <div
            className="
              h-full
              rounded-full
              transition-[width]
              duration-700
              ease-out
            "
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--accent)",
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span
            className="text-[10px] font-medium"
            style={{
              color: "var(--muted)",
            }}
          >
            Прогресс тренировки
          </span>

          <span
            className="
              text-[10px]
              font-semibold
            "
            style={{
              color: "var(--accent)",
            }}
          >
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
