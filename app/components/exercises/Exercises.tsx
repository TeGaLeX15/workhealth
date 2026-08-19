// app/components/Exercises.tsx
import ExerciseCard from "./ExerciseCard";
import type { Exercise } from "./types";

const exerciseDescriptions: Record<string, string> = {
  "pull-ups": "Спина · бицепс · плечи",
  "push-ups": "Грудь · плечи · трицепс",
  dips: "Трицепс · грудь · плечи",
  squats: "Квадрицепс · ягодицы · ноги",
};

type ExercisesProps = {
  exercises: Exercise[];
};

/**
 * Список упражнений пользователя.
 *
 * Отображает карточки доступных упражнений с их описанием.
 * Если упражнения отсутствуют, показывает соответствующее
 * информационное сообщение.
 *
 * @param exercises Список упражнений пользователя.
 * @returns Список карточек упражнений или сообщение об отсутствии упражнений.
 */
export default function Exercises({ exercises }: ExercisesProps) {
  if (exercises.length === 0) {
    return (
      <div
        className="
          rounded-[22px]
          border
          px-5
          py-5
          text-sm
          leading-relaxed
        "
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--muted)",
        }}
      >
        Упражнения пока недоступны.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          description={
            exerciseDescriptions[exercise.slug] ?? "Тренировочное упражнение"
          }
        />
      ))}
    </div>
  );
}
