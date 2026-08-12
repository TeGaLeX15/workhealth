// app/components/workout/active/ActiveWorkoutAction.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type ActiveWorkoutActionProps = {
  workoutId: string;
  isCompleted: boolean;
};

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
