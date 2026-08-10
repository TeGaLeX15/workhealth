// app/api/user/timezone/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";

function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone,
    }).format();

    return true;
  } catch {
    return false;
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Не авторизован",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (typeof body.timezone !== "string" || !isValidTimeZone(body.timezone)) {
      return NextResponse.json(
        {
          error: "Некорректный часовой пояс",
        },
        { status: 400 },
      );
    }

    if (user.timezone === body.timezone) {
      return NextResponse.json({
        timezone: user.timezone,
        updated: false,
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        timezone: body.timezone,
      },
      select: {
        timezone: true,
      },
    });

    return NextResponse.json({
      timezone: updatedUser.timezone,
      updated: true,
    });
  } catch (error) {
    console.error("Timezone update error:", error);

    return NextResponse.json(
      {
        error: "Не удалось обновить часовой пояс",
      },
      { status: 500 },
    );
  }
}
