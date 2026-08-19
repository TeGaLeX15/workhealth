// app/components/workout/WorkoutSession.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import WorkoutProgress from "./WorkoutProgress";
import WorkoutSetScreen from "./WorkoutSetScreen";
import WorkoutRestScreen from "./WorkoutRestScreen";
import RestTimer from "./RestTimer";

import { useSoundSettings } from "@/app/lib/sounds/useSoundSettings";

/**
 * Данные подхода тренировки.
 */
type WorkoutSet = {
  /** Уникальный идентификатор подхода. */
  id: string;

  /** Порядковый номер подхода. */
  setNumber: number;

  /** Целевое количество повторений. */
  targetReps: number;

  /** Фактически выполненное количество повторений. */
  actualReps: number | null;

  /** Указывает, завершён ли подход. */
  completed: boolean;
};

/**
 * Пропсы сессии тренировки.
 */
type WorkoutSessionProps = {
  /** Уникальный идентификатор тренировки. */
  workoutId: string;

  /** Список подходов текущей тренировки. */
  sets: WorkoutSet[];
};

const REST_SECONDS = 60;

const WORKOUT_COMPLETE_EVENT = "bodyos:workout-complete";

/**
 * Управляет интерактивной сессией тренировки.
 *
 * Отвечает за выполнение подходов, переход между ними,
 * запуск и управление таймером отдыха, сохранение результатов
 * и завершение всей тренировки.
 */
export default function WorkoutSession({
  workoutId,
  sets,
}: WorkoutSessionProps) {
  const router = useRouter();
  const soundSettings = useSoundSettings();

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
    };

    updateTimer();

    const timer = window.setInterval(updateTimer, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [isResting, restEndTime]);

  /**
   * Завершает текущий период отдыха и сбрасывает состояние таймера.
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

  /**
   * Завершает текущий подход и сохраняет результат на сервере.
   *
   * После успешного сохранения либо завершает тренировку,
   * либо переводит сессию к следующему подходу и запускает отдых.
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
       *
       * Tell CompletedWorkout that this was
       * an actual completion event.
       */
      if (data.completed) {
        sessionStorage.setItem(
          `${WORKOUT_COMPLETE_EVENT}:${workoutId}`,
          "true",
        );

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

  /**
   * Пропускает текущий период отдыха.
   */
  function skipRest() {
    setIsResting(false);
    setRestEndTime(null);
    setRestSeconds(REST_SECONDS);
    setRestTotalSeconds(REST_SECONDS);
  }

  /**
   * Увеличивает текущий период отдыха на 30 секунд.
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
        countdownEnabled={soundSettings.enabled && soundSettings.restCountdown}
        completeEnabled={soundSettings.enabled && soundSettings.restComplete}
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
