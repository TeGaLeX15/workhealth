// app/components/exercises/max-reps/MaxRepsError.tsx
type MaxRepsErrorProps = {
  error: string;
};

export default function MaxRepsError({ error }: MaxRepsErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <p
      role="alert"
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
        backgroundColor: "color-mix(in srgb, #ef4444 7%, transparent)",
      }}
    >
      {error}
    </p>
  );
}
