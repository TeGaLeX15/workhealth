import { redirect } from "next/navigation";

import { getSessionUser } from "@/app/server/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="pt-8">
        <p className="text-sm font-medium text-emerald-600">
          Главная
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
          Главная
        </h1>
      </header>
    </div>
  );
}