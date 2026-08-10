// app/components/auth/AuthBrand.tsx
import Image from "next/image";

export default function AuthBrand() {
  return (
    <div className="mb-10 text-center">
      <div
        className="
          mx-auto
          flex
          h-[72px]
          w-[72px]
          items-center
          justify-center
          overflow-hidden
          rounded-[22px]
          sm:h-[80px]
          sm:w-[80px]
          sm:rounded-[24px]
        "
        style={{
          boxShadow:
            "0 14px 38px color-mix(in srgb, var(--accent) 18%, transparent)",
        }}
      >
        <Image
          src="/icons/android-chrome-512x512.png"
          alt="Body OS"
          width={512}
          height={512}
          priority
          className="h-full w-full object-cover"
        />
      </div>

      <h1
        className="
          mt-5
          text-[32px]
          font-bold
          leading-none
          tracking-[-0.055em]
        "
        style={{
          color: "var(--foreground)",
        }}
      >
        Body OS
      </h1>

      <p
        className="
          mt-2.5
          text-[15px]
          font-medium
        "
        style={{
          color: "var(--muted)",
        }}
      >
        Твоя система тренировок
      </p>
    </div>
  );
}