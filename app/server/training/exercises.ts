// app/server/training/exercises.ts
import { createHash } from "crypto";
import { cookies } from "next/headers";

import { prisma } from "@/app/server/db";

const SESSION_COOKIE = "bodyos_session";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export type TrainingExercise = {
  id: string;
  name: string;
  slug: string;
  maxReps: number | null;
  maxUpdatedAt: string | null;
};

export async function getTrainingExercises(): Promise<
  TrainingExercise[] | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    select: {
      expiresAt: true,

      user: {
        select: {
          exercises: {
            select: {
              maxReps: true,
              maxUpdatedAt: true,

              exercise: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({
      where: {
        tokenHash,
      },
    });

    cookieStore.delete(SESSION_COOKIE);

    return null;
  }

  return session.user.exercises.map((userExercise) => ({
    id: userExercise.exercise.id,
    name: userExercise.exercise.name,
    slug: userExercise.exercise.slug,
    maxReps: userExercise.maxReps,
    maxUpdatedAt: userExercise.maxUpdatedAt?.toISOString() ?? null,
  }));
}
