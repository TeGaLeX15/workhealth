// app/components/workout/WorkoutFinishedScreen.tsx
"use client";

type WorkoutFinishedScreenProps = {
  onDone: () => void;
};

export default function WorkoutFinishedScreen({
  onDone,
}: WorkoutFinishedScreenProps) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onDone}
        className="
          flex
          h-[56px]
          w-full
          max-w-sm
          items-center
          justify-center
          rounded-[19px]
          text-[15px]
          font-bold
          text-white
          transition-transform
          active:scale-[0.98]
        "
        style={{
          backgroundColor: "var(--accent)",
        }}
      >
        Готово
      </button>
    </div>
  );
}
