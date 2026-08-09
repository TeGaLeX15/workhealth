import Link from "next/link";
import { UserRound } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-3">
      <div className="mx-auto flex h-14 w-full max-w-xl items-center justify-between rounded-2xl border border-zinc-200/80 bg-white/90 px-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-xl">

        {/* Logo */}
        <Link
          href="/"
          aria-label="BodyOS — главная"
          className="flex items-center gap-2.5 rounded-xl px-1 transition-transform active:scale-[0.98]"
        >
          {/* Временный логотип — позже заменим на настоящий */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950">
            <span className="text-sm font-bold tracking-tight text-white">
              B
            </span>
          </div>

          <div className="leading-none">
            <div className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-950">
              BodyOS
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Fitness system
            </div>
          </div>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          aria-label="Профиль"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95"
        >
          <UserRound
            size={19}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </Link>
      </div>
    </header>
  );
}

