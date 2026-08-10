// app/(app)/layout.tsx
import AppHeader from "@/app/components/AppHeader";
import BottomNavigation from "@/app/components/BottomNavigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />

      <main className="mx-auto w-full max-w-xl px-5 pb-24 pt-6 sm:pt-8">
        {children}
      </main>

      <BottomNavigation />
    </>
  );
}
