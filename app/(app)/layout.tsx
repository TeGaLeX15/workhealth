// app/(app)/layout.tsx
import type { ReactNode } from "react";

import AppHeader from "@/app/components/app/AppHeader";
import BottomNavigation from "@/app/components/app/BottomNavigation";
import TimezoneSync from "@/app/components/app/TimezoneSync";
import { requireCurrentUser } from "@/app/server/auth/session";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  await requireCurrentUser();

  return (
    <>
      <TimezoneSync />

      <AppHeader />

      <main className="mx-auto w-full max-w-xl px-5 pb-24 pt-6 sm:pt-8">
        {children}
      </main>

      <BottomNavigation />
    </>
  );
}
