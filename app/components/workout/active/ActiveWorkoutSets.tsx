// app/components/workout/active/ActiveWorkoutSets.tsx
import { Check } from "lucide-react";
import type { WorkoutSet } from "./types";

/**
 * Пропсы компонента со списком подходов активной тренировки.
 */
type ActiveWorkoutSetsProps = {
  /**
   * Список подходов тренировки.
   */
  sets: WorkoutSet[];

  /**
   * Индекс текущего незавершённого подхода.
   *
   * Равно `-1`, если незавершённых подходов нет.
   */
  currentSetIndex: number;

  /**
   * Определяет, завершена ли вся тренировка.
   */
  isCompleted: boolean;
};

/**
 * Отображает последовательность подходов активной тренировки
 * и визуально выделяет завершённые и текущий подходы.
 *
 * Для завершённых подходов отображается иконка выполнения,
 * для остальных — номер подхода и количество повторений.
 *
 * @param props Пропсы компонента.
 * @param props.sets Список подходов тренировки.
 * @param props.currentSetIndex Индекс текущего незавершённого подхода.
 * @param props.isCompleted Определяет, завершена ли вся тренировка.
 * @returns Разметка списка подходов.
 */
export default function ActiveWorkoutSets({
  sets,
  currentSetIndex,
  isCompleted,
}: ActiveWorkoutSetsProps) {
  return (
    <div className="px-5 pb-5 pt-2">
      <div
        className="
          rounded-[22px]
          p-3
        "
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--background) 45%, var(--surface))",
        }}
      >
        <div className="flex gap-2">
          {sets.map((set, index) => {
            /**
             * Определяет, завершён ли текущий подход.
             */
            const completed = set.completed;

            /**
             * Определяет, является ли подход текущим.
             *
             * При завершённой тренировке текущий подход
             * дополнительно не выделяется.
             */
            const current = !isCompleted && index === currentSetIndex;

            return (
              <div
                key={set.id}
                className="
                  relative
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  items-center
                  justify-center
                  rounded-[17px]
                  py-2.5
                  transition-all
                  duration-300
                "
                style={{
                  backgroundColor: current
                    ? "var(--surface)"
                    : completed
                      ? "color-mix(in srgb, var(--accent) 8%, var(--surface))"
                      : "transparent",

                  boxShadow: current
                    ? "0 2px 10px color-mix(in srgb, var(--foreground) 6%, transparent)"
                    : "none",
                }}
              >
                <div
                  className="
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                  "
                  style={{
                    backgroundColor: completed
                      ? "var(--accent)"
                      : current
                        ? "color-mix(in srgb, var(--accent) 11%, var(--surface))"
                        : "color-mix(in srgb, var(--muted) 7%, var(--surface))",
                  }}
                >
                  {completed ? (
                    <Check
                      size={12}
                      strokeWidth={3}
                      style={{
                        color: "white",
                      }}
                    />
                  ) : (
                    <span
                      className="
                        text-[9px]
                        font-bold
                      "
                      style={{
                        color: current ? "var(--accent)" : "var(--muted)",
                      }}
                    >
                      {set.setNumber}
                    </span>
                  )}
                </div>

                <span
                  className="
                    mt-1.5
                    text-[11px]
                    font-semibold
                  "
                  style={{
                    color: current
                      ? "var(--foreground)"
                      : completed
                        ? "var(--accent)"
                        : "var(--muted)",
                  }}
                >
                  {set.actualReps ?? set.targetReps}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
