// app/components/exercises/max-reps/MaxRepsSubmit.tsx
import { ArrowRight } from "lucide-react";

/**
 * Пропсы кнопки продолжения после выполнения упражнения на максимум повторений.
 */
type MaxRepsSubmitProps = {
  /** Показывает состояние подготовки тренировочной программы. */
  isLoading: boolean;

  /** Отключает кнопку, если отправка недоступна. */
  disabled: boolean;

  /** Обрабатывает нажатие на кнопку продолжения. */
  onSubmit: () => void;
};

/**
 * Кнопка отправки результата максимального количества повторений.
 *
 * Во время загрузки отображает сообщение о подготовке программы
 * и блокирует повторное взаимодействие.
 */
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
