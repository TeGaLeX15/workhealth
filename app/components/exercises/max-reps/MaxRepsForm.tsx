// app/components/exercises/max-reps/MaxRepsForm.tsx
"use client";

import MaxRepsCounter from "./MaxRepsCounter";
import MaxRepsError from "./MaxRepsError";
import MaxRepsSubmit from "./MaxRepsSubmit";
import useMaxReps from "./useMaxReps";

type MaxRepsFormProps = {
  exerciseId: string;
};

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
        disabled={inputValue === ""}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
