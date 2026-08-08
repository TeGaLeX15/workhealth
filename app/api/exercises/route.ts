import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 },
      );
    }

    const exercises = await prisma.exercise.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      exercises,
    });
  } catch (error) {
    console.error("Exercises GET error:", error);

    return NextResponse.json(
      { error: "Не удалось получить упражнения" },
      { status: 500 },
    );
  }
}