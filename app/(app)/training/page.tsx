// app/(app)/training/page.tsx
import PageHeader from "@/app/components/app/PageHeader";
import Exercises from "@/app/components/exercises/Exercises";

export default async function TrainingPage() {
  return (
    <>
      {/* HEADER */}
      <PageHeader
        eyebrow="Тренировки"
        title="Выбери упражнение"
        description="Выбери упражнение, чтобы открыть программу"
      />

      {/* EXERCISES */}
      <section>
        <Exercises />
      </section>
    </>
  );
}
