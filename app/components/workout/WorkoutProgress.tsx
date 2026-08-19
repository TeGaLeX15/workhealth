// app/components/WorkoutProgress.tsx
import { Check, Coffee, Dumbbell } from "lucide-react";

/**
 * Представляет минимальные данные тренировочного подхода,
 * необходимые для отображения прогресса тренировки.
 */
type WorkoutSet = {
  id: string;
  setNumber: number;
};

/**
 * Свойства компонента прогресса тренировки.
 */
type WorkoutProgressProps = {
  sets: WorkoutSet[];
  currentIndex: number;
  isResting: boolean;
};

/**
 * Отображает последовательность подходов тренировки,
 * их текущее состояние и состояние отдыха между подходами.
 *
 * Завершённые подходы отображаются с отметкой выполнения,
 * текущий подход выделяется акцентным цветом, а между подходами
 * отображаются индикаторы отдыха.
 *
 * @param props - Свойства компонента.
 * @param props.sets - Список подходов текущей тренировки.
 * @param props.currentIndex - Индекс текущего незавершённого подхода.
 * @param props.isResting - Находится ли пользователь сейчас на отдыхе.
 *
 * @returns Индикатор прогресса тренировки.
 */
export default function WorkoutProgress({
  sets,
  currentIndex,
  isResting,
}: WorkoutProgressProps) {
  return (
    <div className="w-full overflow-visible">
      <div className="flex w-full justify-center overflow-visible px-2">
        <div className="flex w-fit max-w-full items-center overflow-visible">
          {sets.map((set, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = !isResting && index === currentIndex;
            const isRestingAfterSet = isResting && index === currentIndex - 1;

            return (
              <div key={set.id} className="flex shrink-0 items-center">
                {/* SET */}
                <div className="flex shrink-0 items-center justify-center">
                  <div
                    className="
                      relative
                      flex
                      h-[38px]
                      w-[38px]
                      items-center
                      justify-center
                      rounded-full
                      border
                      sm:h-10
                      sm:w-10
                    "
                    style={{
                      backgroundColor: isCompleted
                        ? "color-mix(in srgb, var(--accent) 12%, var(--card))"
                        : isCurrent
                          ? "color-mix(in srgb, var(--accent) 10%, var(--card))"
                          : "var(--surface)",
                      borderColor: isCurrent
                        ? "var(--accent)"
                        : "var(--border)",
                      boxShadow: isCurrent
                        ? "0 0 18px color-mix(in srgb, var(--accent) 18%, transparent)"
                        : "none",
                    }}
                  >
                    {isCompleted ? (
                      <Check
                        size={15}
                        strokeWidth={2.7}
                        style={{
                          color: "var(--accent)",
                        }}
                        aria-hidden="true"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <Dumbbell
                          size={13}
                          strokeWidth={isCurrent ? 2.1 : 1.8}
                          style={{
                            color: isCurrent
                              ? "var(--foreground)"
                              : "var(--muted)",
                          }}
                          aria-hidden="true"
                        />

                        <span
                          className="
                            text-[7px]
                            font-bold
                            leading-none
                            tabular-nums
                          "
                          style={{
                            color: "var(--foreground)",
                          }}
                        >
                          {set.setNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* REST */}
                {index < sets.length - 1 && (
                  <div
                    className="
                      flex
                      h-8
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      sm:w-7
                    "
                  >
                    <Coffee
                      size={isRestingAfterSet ? 14 : 11}
                      strokeWidth={isRestingAfterSet ? 2 : 1.7}
                      style={{
                        color: isRestingAfterSet
                          ? "var(--accent)"
                          : isCompleted
                            ? "color-mix(in srgb, var(--muted) 70%, transparent)"
                            : "var(--muted)",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-2 text-center">
        <span
          className="text-[10px] font-medium sm:text-[11px]"
          style={{
            color: "var(--muted)",
          }}
        >
          {isResting
            ? "Восстановление"
            : `Подход ${currentIndex + 1} из ${sets.length}`}
        </span>
      </div>
    </div>
  );
}
