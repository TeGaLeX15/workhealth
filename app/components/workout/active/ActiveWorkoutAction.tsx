// app/components/workout/active/ActiveWorkoutAction.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Пропсы действия активной тренировки.
 */
type ActiveWorkoutActionProps = {
  /**
   * Идентификатор тренировки.
   */
  workoutId: string;

  /**
   * Определяет, завершена ли тренировка.
   *
   * От этого зависит текст и визуальное оформление кнопки.
   */
  isCompleted: boolean;
};

/**
 * Отображает ссылку для перехода к странице тренировки.
 *
 * Для незавершённой тренировки предлагает продолжить выполнение,
 * а для завершённой — перейти к просмотру тренировки.
 *
 * @param props Пропсы компонента.
 * @param props.workoutId Идентификатор тренировки.
 * @param props.isCompleted Определяет, завершена ли тренировка.
 * @returns Разметка действия тренировки.
 */
export default function ActiveWorkoutAction({
  workoutId,
  isCompleted,
}: ActiveWorkoutActionProps) {
  return (
    <div className="px-5 pb-5">
      <Link
        href={`/training/workouts/${workoutId}`}
        className="
          group
          flex
          h-[52px]
          w-full
          items-center
          justify-between
          rounded-[18px]
          px-4
          transition-transform
          duration-200
          active:scale-[0.985]
        "
        style={{
          backgroundColor: isCompleted
            ? "color-mix(in srgb, var(--muted) 9%, var(--surface))"
            : "var(--accent)",
          color: isCompleted ? "var(--foreground)" : "white",
        }}
      >
        <span
          className="
            text-[13px]
            font-semibold
          "
        >
          {isCompleted ? "Посмотреть тренировку" : "Продолжить тренировку"}
        </span>

        <ChevronRight
          size={18}
          strokeWidth={2}
          className="
            transition-transform
            duration-200
            group-hover:translate-x-0.5
          "
        />
      </Link>
    </div>
  );
}
