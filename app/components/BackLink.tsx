"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BackLinkProps = {
  href?: string;
  label?: string;
};

export default function BackLink({
  href = "/training",
  label = "Тренировки",
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className="
        group
        inline-flex
        min-h-10
        items-center
        gap-2
        rounded-full
        px-2.5
        pr-3.5
        transition-all
        duration-200
        active:scale-[0.97]
      "
      style={{
        color: "var(--muted)",
        backgroundColor:
          "color-mix(in srgb, var(--muted) 6%, transparent)",
      }}
    >
      <span
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
        "
        style={{
          backgroundColor: "var(--surface)",
        }}
      >
        <ArrowLeft
          size={15}
          strokeWidth={2}
          className="
            transition-transform
            duration-200
            group-hover:-translate-x-0.5
          "
        />
      </span>

      <span
        className="
          text-[12px]
          font-semibold
        "
      >
        {label}
      </span>
    </Link>
  );
}