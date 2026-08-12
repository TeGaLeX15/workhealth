// app/components/auth/AuthBrand.tsx
import Image from "next/image";

export default function AuthBrand() {
  return (
    <div className="mb-7 text-center sm:mb-8">
      <div
        className="
          mx-auto
          flex
          h-[68px]
          w-[68px]
          items-center
          justify-center
          overflow-hidden
          rounded-[20px]
          sm:h-[76px]
          sm:w-[76px]
          sm:rounded-[22px]
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
          mt-4
          text-[30px]
          font-bold
          leading-none
          tracking-[-0.05em]
        "
        style={{
          color: "var(--foreground)",
        }}
      >
        Body OS
      </h1>

      <p
        className="
          mt-2
          text-[14px]
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
