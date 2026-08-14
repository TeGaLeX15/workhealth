// app/components/workout/WorkoutSession.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import WorkoutProgress from "./WorkoutProgress";
import WorkoutSetScreen from "./WorkoutSetScreen";
import WorkoutRestScreen from "./WorkoutRestScreen";
import RestTimer from "./RestTimer";

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

  const [restEndTime, setRestEndTime] = useState<number | null>(null);

  const [restSeconds, setRestSeconds] = useState(REST_SECONDS);

  const [restTotalSeconds, setRestTotalSeconds] = useState(REST_SECONDS);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentSet = completedSets[currentIndex];

  /*
   * REST TIMER
   *
   * restEndTime is the source of truth.
   * The interval only keeps the visible countdown updated.
   */
  useEffect(() => {
    if (!isResting || restEndTime === null) {
      return;
    }

    const updateTimer = () => {
      const remainingMs = restEndTime - Date.now();

      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

      setRestSeconds(remainingSeconds);

      /*
       * Do NOT finish the rest here.
       *
       * RestTimer must first receive 0, play the finishing
       * sound and then call handleRestComplete().
       */
    };

    updateTimer();

    const timer = window.setInterval(updateTimer, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [isResting, restEndTime]);

  /*
   * Called by RestTimer after the finishing sound
   * has successfully been started.
   */
  const handleRestComplete = useCallback(() => {
    setIsResting(false);
    setRestEndTime(null);
    setRestSeconds(REST_SECONDS);
    setRestTotalSeconds(REST_SECONDS);
  }, []);

  /*
   * Protect against an invalid/completed state.
   */
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

  /*
   * Complete current set.
   */
  async function handleCompleteSet() {
    if (isLoading || isResting) {
      return;
    }

    setIsLoading(true);
    setError("");

    /*
     * Activate Web Audio from the user's gesture.
     *
     * This is important for mobile browsers/PWA.
     */
    window.dispatchEvent(new Event("bodyos:activate-rest-audio"));

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

      /*
       * Workout finished.
       */
      if (data.completed) {
        router.refresh();
        return;
      }

      /*
       * Move to the next set.
       */
      setCurrentIndex((index) => index + 1);

      /*
       * Start rest.
       */
      const endTime = Date.now() + REST_SECONDS * 1000;

      setRestEndTime(endTime);
      setRestSeconds(REST_SECONDS);
      setRestTotalSeconds(REST_SECONDS);
      setIsResting(true);
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setIsLoading(false);
    }
  }

  /*
   * Skip rest.
   */
  function skipRest() {
    setIsResting(false);
    setRestEndTime(null);
    setRestSeconds(REST_SECONDS);
    setRestTotalSeconds(REST_SECONDS);
  }

  /*
   * Add 30 seconds.
   */
  function increaseRest() {
    setRestEndTime((currentEndTime) => {
      const baseTime =
        currentEndTime && currentEndTime > Date.now()
          ? currentEndTime
          : Date.now();

      return baseTime + 30 * 1000;
    });

    setRestSeconds((seconds) => seconds + 30);
    setRestTotalSeconds((seconds) => seconds + 30);
  }

  return (
    <div className="w-full">
      {/* REST AUDIO / COMPLETION */}

      <RestTimer
        restSeconds={restSeconds}
        isResting={isResting}
        onComplete={handleRestComplete}
      />

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
