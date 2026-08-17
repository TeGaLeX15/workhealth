// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { deleteSession } from "@/app/server/auth/session";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        error: "Не удалось выйти из аккаунта",
      },
      {
        status: 500,
      },
    );
  }
}
