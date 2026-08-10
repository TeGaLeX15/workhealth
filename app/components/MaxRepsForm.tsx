"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";

type MaxRepsFormProps = {
  exerciseId: string;
};

const MIN_REPS = 1;
const MAX_REPS = 1000;

export default function MaxRepsForm({
  exerciseId,
}: MaxRepsFormProps) {
  const router = useRouter();

  const [maxReps, setMaxReps] = useState(10);
  const [inputValue, setInputValue] = useState("10");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const intervalRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Counter ──────────────────────────────────────────────────────────────

  const changeReps = useCallback((amount: number) => {
    setMaxReps((current) => {
      const next = Math.min(
        MAX_REPS,
        Math.max(MIN_REPS, current + amount),
      );

      setInputValue(String(next));

      return next;
    });
  }, []);

  const stopPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPress = useCallback(
    (direction: 1 | -1) => {
      if (isLoading) return;

      stopPress();
      changeReps(direction);

      timerRef.current = setTimeout(() => {
        let delay = 180;

        const repeat = () => {
          changeReps(direction);

          delay = Math.max(55, delay - 15);

          intervalRef.current = setTimeout(
            repeat,
            delay,
          );
        };

        intervalRef.current = setTimeout(
          repeat,
          delay,
        );
      }, 400);
    },
    [changeReps, isLoading, stopPress],
  );

  useEffect(() => {
    return () => stopPress();
  }, [stopPress]);

  // ─── Input ────────────────────────────────────────────────────────────────

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const rawValue = event.target.value;

    if (rawValue === "") {
      setInputValue("");
      return;
    }

    if (!/^\d+$/.test(rawValue)) {
      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      return;
    }

    const clampedValue = Math.min(
      MAX_REPS,
      Math.max(MIN_REPS, Math.floor(value)),
    );

    setInputValue(String(clampedValue));
    setMaxReps(clampedValue);
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (isLoading) return;

    stopPress();
    setError("");
    setIsLoading(true);

    try {
      const maxResponse = await fetch(
        `/api/exercises/${exerciseId}/max`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            maxReps,
          }),
        },
      );

      const maxData = await maxResponse.json();

      if (!maxResponse.ok) {
        setError(
          maxData.error ??
            "Не удалось сохранить максимум",
        );
        return;
      }

      const weekResponse = await fetch(
        "/api/training-weeks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exerciseId,
          }),
        },
      );

      const weekData = await weekResponse.json();

      if (!weekResponse.ok) {
        setError(
          weekData.error ??
            "Не удалось создать программу",
        );
        return;
      }

      if (!weekData.workoutId) {
        setError("Тренировка не найдена");
        return;
      }

      router.push(
        `/workouts/${weekData.workoutId}`,
      );
    } catch {
      setError(
        "Не удалось подключиться к серверу",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Counter */}
      <div className="flex items-center justify-center gap-[clamp(14px,5vw,28px)]">
        {/* Minus */}
        <button
          type="button"
          disabled={
            isLoading ||
            maxReps <= MIN_REPS
          }
          onPointerDown={() =>
            startPress(-1)
          }
          onPointerUp={stopPress}
          onPointerCancel={stopPress}
          onPointerLeave={stopPress}
          aria-label="Уменьшить"
          className="
            group
            flex
            h-[clamp(56px,18vw,72px)]
            w-[clamp(56px,18vw,72px)]
            shrink-0
            items-center
            justify-center
            rounded-[clamp(18px,6vw,24px)]
            border
            transition-all
            duration-150
            active:scale-[0.91]
            disabled:opacity-20
          "
          style={{
            borderColor:
              "color-mix(in srgb, var(--foreground) 9%, transparent)",
            backgroundColor:
              "color-mix(in srgb, var(--foreground) 5%, var(--surface))",
            touchAction: "none",
          }}
        >
          <Minus
            size={30}
            strokeWidth={2.3}
            className="
              transition-transform
              duration-150
              group-active:scale-90
            "
            style={{
              color: "var(--foreground)",
            }}
          />
        </button>

        {/* Number */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (
              !/[0-9]/.test(event.key) &&
              event.key !== "Backspace" &&
              event.key !== "Delete" &&
              event.key !== "ArrowLeft" &&
              event.key !== "ArrowRight" &&
              event.key !== "Tab" &&
              event.key !== "Home" &&
              event.key !== "End"
            ) {
              event.preventDefault();
            }
          }}
          disabled={isLoading}
          aria-label="Максимум повторений"
          className="
            w-[clamp(150px,42vw,220px)]
            appearance-none
            bg-transparent
            p-0
            text-center
            font-extrabold
            outline-none
            [appearance:textfield]
          "
          style={{
            color: "var(--foreground)",
            fontVariantNumeric: "tabular-nums",
            fontSize: "clamp(52px,16vw,72px)",
            lineHeight: "0.9",
          }}
        />

        {/* Plus */}
        <button
          type="button"
          disabled={
            isLoading ||
            maxReps >= MAX_REPS
          }
          onPointerDown={() =>
            startPress(1)
          }
          onPointerUp={stopPress}
          onPointerCancel={stopPress}
          onPointerLeave={stopPress}
          aria-label="Увеличить"
          className="
            group
            flex
            h-[clamp(56px,18vw,72px)]
            w-[clamp(56px,18vw,72px)]
            shrink-0
            items-center
            justify-center
            rounded-[clamp(18px,6vw,24px)]
            border
            transition-all
            duration-150
            active:scale-[0.91]
            disabled:opacity-20
          "
          style={{
            borderColor:
              "color-mix(in srgb, var(--foreground) 9%, transparent)",
            backgroundColor:
              "color-mix(in srgb, var(--foreground) 5%, var(--surface))",
            touchAction: "none",
          }}
        >
          <Plus
            size={30}
            strokeWidth={2.3}
            className="
              transition-transform
              duration-150
              group-active:scale-90
            "
            style={{
              color: "var(--foreground)",
            }}
          />
        </button>
      </div>

      {/* Unit */}
      <span
        className="
          mt-3
          text-center
          text-[15px]
          font-medium
        "
        style={{
          color: "var(--muted)",
        }}
      >
        повторений
      </span>

      {/* Error */}
      {error && (
        <p
          className="
            mx-auto
            mt-4
            max-w-[340px]
            rounded-[18px]
            px-5
            py-3
            text-center
            text-[14px]
            leading-5
          "
          style={{
            color: "#ef4444",
            backgroundColor:
              "color-mix(in srgb, #ef4444 7%, transparent)",
          }}
        >
          {error}
        </p>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || inputValue === ""}
        className="
          mt-6
          flex
          h-[clamp(56px,16vw,68px)]
          w-full
          items-center
          justify-center
          gap-3
          rounded-[20px]
          px-5
          text-[16px]
          font-bold
          tracking-[-0.01em]
          transition-all
          duration-150
          active:scale-[0.98]
          disabled:opacity-50
        "
        style={{
          backgroundColor: "var(--accent)",
          color: "#fff",
        }}
      >
        <span>
          {isLoading
            ? "Готовим программу..."
            : "Продолжить"}
        </span>

        {!isLoading && (
          <ArrowRight
            size={21}
            strokeWidth={2.2}
          />
        )}
      </button>
    </div>
  );
}
