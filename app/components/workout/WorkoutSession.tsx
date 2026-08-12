// app/components/WorkoutSession.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import WorkoutProgress from "./WorkoutProgress";
import WorkoutSetScreen from "./WorkoutSetScreen";
import WorkoutRestScreen from "./WorkoutRestScreen";

type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
};

type WorkoutSessionProps = {
  workoutId: string;
  sets: WorkoutSet[];
};

const REST_SECONDS = 60;

export default function WorkoutSession({
  workoutId,
  sets,
}: WorkoutSessionProps) {
  const router = useRouter();

  const [completedSets, setCompletedSets] = useState<WorkoutSet[]>(sets);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const firstIncomplete = sets.findIndex((set) => !set.completed);

    return firstIncomplete === -1 ? sets.length : firstIncomplete;
  });

  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(REST_SECONDS);
  const [restTotalSeconds, setRestTotalSeconds] = useState(REST_SECONDS);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentSet = completedSets[currentIndex];

  // Rest timer effect
  useEffect(() => {
    if (!isResting) return;

    const timer = window.setInterval(() => {
      setRestSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isResting]);

  // Finish resting state when restSeconds reaches 0
  useEffect(() => {
    if (!isResting || restSeconds !== 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsResting(false);
      setRestSeconds(REST_SECONDS);
      setRestTotalSeconds(REST_SECONDS);
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isResting, restSeconds]);

  // Protect against an invalid/completed state
  if (!currentSet) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p
          className="text-sm"
          style={{
            color: "var(--muted)",
          }}
        >
          Тренировка завершена
        </p>
      </div>
    );
  }

  // Complete set function
  async function handleCompleteSet() {
    if (isLoading || isResting) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/workouts/${workoutId}/sets/${currentSet.id}/complete`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Не удалось сохранить подход");
        return;
      }

      setCompletedSets((previous) =>
        previous.map((set) =>
          set.id === currentSet.id
            ? {
                ...set,
                completed: true,
                actualReps: set.targetReps,
              }
            : set,
        ),
      );

      if (data.completed) {
        router.refresh();
        return;
      }

      setCurrentIndex((index) => index + 1);

      setRestSeconds(REST_SECONDS);
      setRestTotalSeconds(REST_SECONDS);
      setIsResting(true);
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setIsLoading(false);
    }
  }

  // Rest control functions
  function skipRest() {
    setIsResting(false);
    setRestSeconds(REST_SECONDS);
    setRestTotalSeconds(REST_SECONDS);
  }

  function increaseRest() {
    setRestSeconds((seconds) => seconds + 30);
    setRestTotalSeconds((seconds) => seconds + 30);
  }

  return (
    <div className="w-full">
      {/* PROGRESS */}
      <div className="mt-8 sm:mt-10">
        <WorkoutProgress
          sets={completedSets}
          currentIndex={currentIndex}
          isResting={isResting}
        />
      </div>

      {/* CURRENT STATE */}
      {isResting ? (
        <WorkoutRestScreen
          currentSet={currentSet}
          restSeconds={restSeconds}
          restTotalSeconds={restTotalSeconds}
          onSkip={skipRest}
          onIncrease={increaseRest}
        />
      ) : (
        <WorkoutSetScreen
          currentSet={currentSet}
          isLoading={isLoading}
          error={error}
          onComplete={handleCompleteSet}
        />
      )}
    </div>
  );
}
