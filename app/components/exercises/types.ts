// app/components/exercises/types.ts
export type Exercise = {
  id: string;
  name: string;
  slug: string;
  maxReps: number | null;
  maxUpdatedAt: string | null;
};
