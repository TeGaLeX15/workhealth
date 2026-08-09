// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { deleteSession } from "@/app/server/auth/session";

export async function POST(request: Request) {
  try {
    await deleteSession();

    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        error: "Не удалось выйти из аккаунта",
      },
      { status: 500 },
    );
  }
}