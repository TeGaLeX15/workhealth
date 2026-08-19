// app/components/TrainingWeekCard.tsx
import TrainingWeekHeader from "./training/TrainingWeekHeader";
import TrainingWorkoutCard from "./training/TrainingWorkoutCard";
import FutureWorkoutCard from "./training/FutureWorkoutCard";
import SkippedWorkoutCard from "./training/SkippedWorkoutCard";

import type { TrainingWeekCardProps } from "./training/types";

/**
 * Отображает тренировочную неделю и список тренировок,
 * распределяя их по соответствующим состояниям.
 *
 * @param weekNumber Номер тренировочной недели.
 * @param startDate Дата начала недели.
 * @param endDate Дата окончания недели.
 * @param workouts Тренировки текущей недели.
 * @param currentWorkoutId Идентификатор текущей доступной тренировки.
 * @returns Карточка тренировочной недели.
 */
export default function TrainingWeekCard({
  weekNumber,
  startDate,
  endDate,
  workouts,
  currentWorkoutId,
}: TrainingWeekCardProps) {
  return (
    <section>
      <TrainingWeekHeader
        weekNumber={weekNumber}
        startDate={startDate}
        endDate={endDate}
        workoutCount={workouts.length}
      />

      <div className="mt-4 space-y-3">
        {workouts.map((workout) => {
          const isSkipped = workout.status === "SKIPPED";

          const isCurrent = workout.id === currentWorkoutId;

          const isFuture = workout.status === "PLANNED" && !isCurrent;

          if (isSkipped) {
            return <SkippedWorkoutCard key={workout.id} workout={workout} />;
          }

          if (isFuture) {
            return <FutureWorkoutCard key={workout.id} workout={workout} />;
          }

          return <TrainingWorkoutCard key={workout.id} workout={workout} />;
        })}
      </div>
    </section>
  );
}
