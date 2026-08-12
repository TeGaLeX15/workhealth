// app/components/exercises/max-reps/MaxRepsSubmit.tsx
import { ArrowRight } from "lucide-react";

type MaxRepsSubmitProps = {
  isLoading: boolean;
  disabled: boolean;
  onSubmit: () => void;
};

export default function MaxRepsSubmit({
  isLoading,
  disabled,
  onSubmit,
}: MaxRepsSubmitProps) {
  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={isLoading || disabled}
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
      <span>{isLoading ? "Готовим программу..." : "Продолжить"}</span>

      {!isLoading && <ArrowRight size={21} strokeWidth={2.2} />}
    </button>
  );
}
