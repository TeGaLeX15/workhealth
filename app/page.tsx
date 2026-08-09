import { redirect } from "next/navigation";

import { getSessionUser } from "@/app/server/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="pt-6">
        <p
          className="text-sm font-medium"
          style={{
            color: "var(--muted)",
          }}
        >
          Добро пожаловать
        </p>

        <h1
          className="mt-1 text-3xl font-bold tracking-[-0.035em]"
          style={{
            color: "var(--foreground)",
          }}
        >
          Главная
        </h1>
      </header>

      <section
        className="mt-6 rounded-2xl border p-5"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.12em]"
              style={{
                color: "var(--muted)",
              }}
            >
              Сегодня
            </p>

            <h2
              className="mt-1 text-xl font-bold"
              style={{
                color: "var(--foreground)",
              }}
            >
              Готов к тренировке?
            </h2>
          </div>

          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{
              backgroundColor: "var(--accent)",
            }}
          >
            GO
          </div>
        </div>
      </section>
    </div>
  );
}
