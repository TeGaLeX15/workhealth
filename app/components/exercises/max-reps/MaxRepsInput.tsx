// app/components/exercises/max-reps/MaxRepsInput.tsx
type MaxRepsInputProps = {
  /** Текущее значение количества повторений. */
  value: string;

  /** Отключает поле ввода. */
  disabled: boolean;

  /** Обрабатывает изменение значения. */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Поле ввода максимального количества повторений.
 *
 * Разрешает ввод только числовых значений и поддерживает
 * цифровую клавиатуру на мобильных устройствах.
 */
export default function MaxRepsInput({
  value,
  disabled,
  onChange,
}: MaxRepsInputProps) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={onChange}
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
      disabled={disabled}
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
  );
}
