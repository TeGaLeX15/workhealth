// app/components/training/TrainingWorkoutCard.tsx
import type { FC } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

import type { Workout } from "./types";
import {
  formatWorkoutDate,
  getCompletedSets,
  getCurrentSetIndex,
  getStatusLabel,
  getStatusStyle,
  getWorkoutCardStyle,
  getWorkoutProgress,
} from "./utils";
import WorkoutSetsPreview from "./WorkoutSetsPreview";

type TrainingWorkoutCardProps = {
  workout: Workout;
};

const TrainingWorkoutCard: FC<TrainingWorkoutCardProps> = ({ workout }) => {
  const isInProgress = workout.status === "IN_PROGRESS";
  const isCompleted = workout.status === "COMPLETED";
  const isCancelled = workout.status === "CANCELLED";

  const completedSets = getCompletedSets(workout.sets);
  const totalSets = workout.sets.length;

  const progress = getWorkoutProgress(workout.sets);

  const currentSetIndex = getCurrentSetIndex(workout);

  const workoutDate = formatWorkoutDate(workout.scheduledDate);

  return (
    <Link
      href={`/training/workouts/${workout.id}`}
      className={[
        "group relative block overflow-hidden",
        "rounded-[24px] border",
        "transition-all duration-200",
        "active:scale-[0.985]",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[var(--accent)]",
        isCancelled ? "opacity-60" : "",
      ].join(" ")}
      style={getWorkoutCardStyle(workout.status)}
    >
      {/* ACTIVE INDICATOR */}

      {isInProgress && (
        <div
          className="h-1 w-full"
          style={{
            backgroundColor: "var(--accent)",
          }}
          aria-hidden="true"
        />
      )}

      {/* HEADER */}

      <div className="px-4 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.12em]
              "
              style={{
                color: "var(--muted)",
              }}
            >
              {workoutDate}
            </p>

            <h4
              className="
                mt-1
                text-[19px]
                font-bold
                leading-tight
                tracking-[-0.03em]
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              Тренировка #{workout.workoutNumber}
            </h4>
          </div>

          <span
            className="
              shrink-0
              rounded-full
              px-2.5
              py-1.5
              text-[10px]
              font-semibold
              leading-none
            "
            style={getStatusStyle(workout.status)}
          >
            {getStatusLabel(workout.status)}
          </span>
        </div>

        {/* PROGRESS */}

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-[16px] font-bold"
                style={{
                  color: "var(--foreground)",
                }}
              >
                {completedSets}
              </span>

              <span
                className="text-[12px]"
                style={{
                  color: "var(--muted)",
                }}
              >
                из {totalSets} подходов
              </span>
            </div>

            {isInProgress && (
              <span
                className="text-[11px] font-bold"
                style={{
                  color: "var(--accent)",
                }}
              >
                {progress}%
              </span>
            )}
          </div>

          <div
            className="
              mt-2
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
                transition-all
                duration-500
              "
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--accent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* SETS */}

      <WorkoutSetsPreview
        sets={workout.sets}
        isInProgress={isInProgress}
        currentSetIndex={currentSetIndex}
      />

      {/* BOTTOM ACTION */}

      <div
        className="
          flex
          min-h-[52px]
          items-center
          justify-between
          border-t
          px-4
        "
        style={{
          borderColor: "var(--border)",
        }}
      >
        <div className="flex min-w-0 items-center gap-2">
          {isCompleted && (
            <Check
              size={15}
              strokeWidth={2.5}
              style={{
                color: "var(--accent)",
              }}
              aria-hidden="true"
            />
          )}

          {isInProgress && (
            <span
              className="
                h-2
                w-2
                shrink-0
                rounded-full
              "
              style={{
                backgroundColor: "var(--accent)",
              }}
              aria-hidden="true"
            />
          )}

          <span
            className="
              truncate
              text-[12px]
              font-semibold
            "
            style={{
              color: isInProgress
                ? "var(--accent)"
                : isCompleted
                  ? "var(--muted)"
                  : isCancelled
                    ? "#ef4444"
                    : "var(--muted)",
            }}
          >
            {isCompleted
              ? "Тренировка завершена"
              : isInProgress
                ? "Продолжить тренировку"
                : isCancelled
                  ? "Тренировка отменена"
                  : "Начать тренировку"}
          </span>
        </div>

        {!isCompleted && !isCancelled && (
          <ChevronRight
            size={18}
            strokeWidth={1.8}
            className="
              shrink-0
              transition-transform
              duration-200
              group-hover:translate-x-0.5
            "
            style={{
              color: isInProgress ? "var(--accent)" : "var(--muted)",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </Link>
  );
};

export default TrainingWorkoutCard;
