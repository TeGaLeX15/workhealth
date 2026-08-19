// app/components/exercises/max-reps/MaxRepsForm.tsx
"use client";

import MaxRepsCounter from "./MaxRepsCounter";
import MaxRepsError from "./MaxRepsError";
import MaxRepsSubmit from "./MaxRepsSubmit";
import useMaxReps from "./useMaxReps";

/**
 * Пропсы формы ввода максимального количества повторений.
 */
type MaxRepsFormProps = {
  /** Идентификатор упражнения. */
  exerciseId: string;
};

/**
 * Форма для ввода и отправки максимального количества повторений.
 *
 * Управляет состоянием через `useMaxReps` и объединяет счётчик,
 * единицу измерения, отображение ошибки и кнопку продолжения.
 */
export default function MaxRepsForm({ exerciseId }: MaxRepsFormProps) {
  const {
    maxReps,
    inputValue,
    error,
    isLoading,
    startPress,
    stopPress,
    handleInputChange,
    handleSubmit,
  } = useMaxReps(exerciseId);

  return (
    <div className="flex flex-col">
      {/* Counter */}
      <MaxRepsCounter
        maxReps={maxReps}
        inputValue={inputValue}
        isLoading={isLoading}
        onStartPress={startPress}
        onStopPress={stopPress}
        onInputChange={handleInputChange}
      />

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
      <MaxRepsError error={error} />

      {/* CTA */}
      <MaxRepsSubmit
        isLoading={isLoading}
        disabled={isLoading || inputValue === ""}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
