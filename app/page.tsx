import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/server/auth/session";
import Exercises from "./components/Exercises";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8">
        <header>
          <p className="text-sm text-zinc-500">WorkHealth</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Тренировка
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Выбери упражнение, чтобы начать.
          </p>
        </header>

        <Exercises />

        <div className="mt-auto pt-10">
          <p className="text-center text-xs text-zinc-600">
            {user.email}
          </p>
        </div>
      </div>
    </main>
  );
}