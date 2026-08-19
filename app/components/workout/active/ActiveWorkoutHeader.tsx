// app/components/workout/active/ActiveWorkoutHeader.tsx
import { Dumbbell, Trophy } from "lucide-react";

/**
 * Пропсы заголовка активной тренировки.
 */
type ActiveWorkoutHeaderProps = {
  /**
   * Порядковый номер тренировки.
   */
  workoutNumber: number;

  /**
   * Количество завершённых подходов.
   */
  completedSets: number;

  /**
   * Общее количество подходов.
   */
  totalSets: number;

  /**
   * Определяет, завершена ли вся тренировка.
   */
  isCompleted: boolean;
};

/**
 * Отображает заголовок активной тренировки с её номером
 * и текущим количеством выполненных подходов.
 *
 * Для завершённой тренировки вместо иконки гантели
 * отображается трофей.
 *
 * @param props Пропсы компонента.
 * @param props.workoutNumber Порядковый номер тренировки.
 * @param props.completedSets Количество завершённых подходов.
 * @param props.totalSets Общее количество подходов.
 * @param props.isCompleted Определяет, завершена ли тренировка.
 * @returns Разметка заголовка тренировки.
 */
export default function ActiveWorkoutHeader({
  workoutNumber,
  completedSets,
  totalSets,
  isCompleted,
}: ActiveWorkoutHeaderProps) {
  return (
    <div className="px-5 pb-4 pt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-[15px]
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent) 9%, var(--surface))",
            }}
          >
            {isCompleted ? (
              <Trophy
                size={18}
                strokeWidth={1.8}
                style={{
                  color: "var(--accent)",
                }}
              />
            ) : (
              <Dumbbell
                size={18}
                strokeWidth={1.8}
                style={{
                  color: "var(--accent)",
                }}
              />
            )}
          </div>

          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
              "
              style={{
                color: "var(--muted)",
              }}
            >
              Тренировка
            </p>

            <p
              className="
                mt-0.5
                text-[16px]
                font-bold
                tracking-[-0.02em]
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              {workoutNumber}
            </p>
          </div>
        </div>

        <div
          className="
            flex
            h-9
            items-center
            rounded-full
            px-3
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent) 8%, var(--surface))",
          }}
        >
          <span
            className="
              text-[12px]
              font-semibold
            "
            style={{
              color: "var(--accent)",
            }}
          >
            {completedSets}

            <span
              style={{
                color: "var(--muted)",
              }}
            >
              {" "}
              / {totalSets}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
