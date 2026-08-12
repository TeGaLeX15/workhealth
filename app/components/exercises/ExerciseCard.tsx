// app/components/exercises/ExerciseCard.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Dumbbell } from "lucide-react";
import type { Exercise } from "./types";

type ExerciseCardProps = {
  exercise: Exercise;
  description: string;
};

const exerciseIcons: Record<string, string> = {
  "pull-ups": "/exercises/pull-ups.png",
  "push-ups": "/exercises/push-ups.png",
  dips: "/exercises/dips.png",
  squats: "/exercises/squats.png",
};

export default function ExerciseCard({
  exercise,
  description,
}: ExerciseCardProps) {
  const icon = exerciseIcons[exercise.slug];
  const hasMaxReps = exercise.maxReps !== null;

  return (
    <Link
      href={`/training/exercise/${exercise.id}`}
      className="
        group
        flex
        min-h-[124px]
        w-full
        cursor-pointer
        overflow-hidden
        rounded-[26px]
        border
        text-left
        transition-all
        duration-200
        hover:border-[color-mix(in_srgb,var(--accent)_28%,var(--border))]
        hover:bg-[color-mix(in_srgb,var(--accent)_2%,var(--card))]
        active:scale-[0.985]
        active:bg-[color-mix(in_srgb,var(--accent)_3%,var(--card))]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--accent)]
        focus-visible:ring-offset-2
        motion-reduce:transition-none
      "
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* IMAGE */}
      <div
        className="
          relative
          w-[100px]
          shrink-0
          overflow-hidden
          sm:w-[112px]
        "
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--accent) 9%, var(--surface))",
        }}
      >
        {icon ? (
          <Image
            src={icon}
            alt=""
            fill
            sizes="(min-width: 640px) 112px, 100px"
            className="object-cover"
            draggable={false}
            aria-hidden="true"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Dumbbell
              size={32}
              strokeWidth={1.7}
              style={{
                color: "var(--accent)",
              }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 items-center">
        <div className="min-w-0 flex-1 px-4 py-4 sm:px-5">
          {/* TITLE */}
          <h2
            className="
              truncate
              text-[18px]
              font-bold
              leading-tight
              tracking-[-0.025em]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {exercise.name}
          </h2>

          {/* MUSCLE GROUPS */}
          <p
            className="
              mt-1.5
              line-clamp-1
              text-[12px]
              font-medium
              leading-[1.4]
            "
            style={{
              color: "var(--muted)",
            }}
          >
            {description}
          </p>

          {/* PERSONAL RECORD */}
          <div className="mt-3 flex items-center gap-2">
            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
              "
              style={{
                backgroundColor: hasMaxReps
                  ? "color-mix(in srgb, var(--accent) 10%, transparent)"
                  : "var(--surface)",
                color: hasMaxReps ? "var(--accent)" : "var(--subtle)",
              }}
            >
              <Award size={14} strokeWidth={1.9} aria-hidden="true" />
            </div>

            <div className="min-w-0 leading-none">
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                "
                style={{
                  color: "var(--subtle)",
                }}
              >
                Личный рекорд
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-[12px]
                  font-bold
                  tabular-nums
                "
                style={{
                  color: hasMaxReps ? "var(--accent)" : "var(--muted)",
                }}
              >
                {hasMaxReps
                  ? `${exercise.maxReps} повторений`
                  : "Не установлен"}
              </p>
            </div>
          </div>
        </div>

        {/* OPEN */}
        <div
          aria-hidden="true"
          className="
            flex
            h-full
            w-[40px]
            shrink-0
            items-center
            justify-center
            border-l
            transition-colors
            duration-200
            group-hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)]
            group-active:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]
            motion-reduce:transition-none
          "
          style={{
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          <ArrowRight
            size={18}
            strokeWidth={1.8}
            className="
              transition-all
              duration-200
              group-hover:translate-x-0.5
              group-hover:text-[var(--accent)]
              group-active:translate-x-0.5
              motion-reduce:transition-none
            "
          />
        </div>
      </div>
    </Link>
  );
}
