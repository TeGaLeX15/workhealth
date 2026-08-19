// app/components/exercises/max-reps/MaxRepsCounter.tsx
import { Minus, Plus } from "lucide-react";

import MaxRepsInput from "./MaxRepsInput";

/**
 * Пропсы счётчика максимального количества повторений.
 */
type MaxRepsCounterProps = {
  /** Текущее количество повторений. */
  maxReps: number;

  /** Текущее значение в поле ввода. */
  inputValue: string;

  /** Показывает состояние загрузки и блокирует взаимодействие. */
  isLoading: boolean;

  /** Запускает изменение количества повторений в указанном направлении. */
  onStartPress: (direction: 1 | -1) => void;

  /** Останавливает изменение количества повторений. */
  onStopPress: () => void;

  /** Обрабатывает изменение значения в поле ввода. */
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Счётчик максимального количества повторений.
 *
 * Позволяет изменять значение кнопками увеличения и уменьшения
 * или вводить его вручную через числовое поле.
 */
export default function MaxRepsCounter({
  maxReps,
  inputValue,
  isLoading,
  onStartPress,
  onStopPress,
  onInputChange,
}: MaxRepsCounterProps) {
  const MIN_REPS = 1;
  const MAX_REPS = 1000;

  return (
    <div className="flex items-center justify-center gap-[clamp(14px,5vw,28px)]">
      {/* Minus */}

      <button
        type="button"
        disabled={isLoading || maxReps <= MIN_REPS}
        onPointerDown={() => onStartPress(-1)}
        onPointerUp={onStopPress}
        onPointerCancel={onStopPress}
        onPointerLeave={onStopPress}
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
          borderColor: "color-mix(in srgb, var(--foreground) 9%, transparent)",
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

      <MaxRepsInput
        value={inputValue}
        disabled={isLoading}
        onChange={onInputChange}
      />

      {/* Plus */}

      <button
        type="button"
        disabled={isLoading || maxReps >= MAX_REPS}
        onPointerDown={() => onStartPress(1)}
        onPointerUp={onStopPress}
        onPointerCancel={onStopPress}
        onPointerLeave={onStopPress}
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
          borderColor: "color-mix(in srgb, var(--foreground) 9%, transparent)",
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
  );
}
