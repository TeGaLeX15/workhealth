// app/components/training/TrainingWeekHeader.tsx
import type { FC } from "react";

import { formatDateRange, getWorkoutLabel } from "./utils";

/**
 * Пропсы заголовка тренировочной недели.
 */
type TrainingWeekHeaderProps = {
  /** Номер тренировочной недели. */
  weekNumber: number;

  /** Дата начала недели. */
  startDate: Date;

  /** Дата окончания недели. */
  endDate: Date;

  /** Количество тренировок в неделе. */
  workoutCount: number;
};

/**
 * Заголовок тренировочной недели.
 *
 * Отображает номер недели, диапазон дат и количество запланированных
 * тренировок с корректным склонением.
 */
const TrainingWeekHeader: FC<TrainingWeekHeaderProps> = ({
  weekNumber,
  startDate,
  endDate,
  workoutCount,
}) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
          "
          style={{
            color: "var(--accent)",
          }}
        >
          Тренировочная неделя
        </p>

        <div
          className="
            mt-1
            flex
            flex-wrap
            items-baseline
            gap-x-2
            gap-y-0.5
          "
        >
          <h3
            className="
              text-[20px]
              font-bold
              tracking-[-0.035em]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            Неделя {weekNumber}
          </h3>

          <span
            className="
              text-[12px]
              font-medium
            "
            style={{
              color: "var(--muted)",
            }}
          >
            {formatDateRange(startDate, endDate)}
          </span>
        </div>
      </div>

      <span
        className="
          shrink-0
          rounded-full
          px-3
          py-1.5
          text-[11px]
          font-semibold
        "
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--muted) 7%, var(--surface))",
          color: "var(--muted)",
        }}
      >
        {workoutCount} {getWorkoutLabel(workoutCount)}
      </span>
    </div>
  );
};

export default TrainingWeekHeader;
