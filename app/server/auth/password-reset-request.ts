// app/server/auth/password-reset-request.ts
import { prisma } from "@/app/server/db";
import {
  generatePasswordResetToken,
  getPasswordResetExpiration,
} from "@/app/server/auth/password-reset";
import { sendPasswordResetEmail } from "@/app/server/email/password-reset";

const RATE_LIMIT_WINDOW_MS = 60_000;

export async function createPasswordResetRequest(
  email: string,
  origin: string,
) {
  const now = new Date();
  const rateLimitSince = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  const recentRequest = await prisma.passwordResetRequest.findFirst({
    where: {
      email,
      createdAt: {
        gte: rateLimitSince,
      },
    },
    select: {
      id: true,
      createdAt: true,
    },
  });

  if (recentRequest) {
    return;
  }

  await prisma.passwordResetRequest.create({
    data: {
      email,
      createdAt: now,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return;
  }

  const { token, tokenHash } = generatePasswordResetToken();
  const expiresAt = getPasswordResetExpiration();

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
      data: {
        usedAt: now,
      },
    }),

    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    }),
  ]);

  const resetUrl = new URL("/reset-password", origin);

  resetUrl.searchParams.set("token", token);

  await sendPasswordResetEmail({
    to: user.email,
    resetUrl: resetUrl.toString(),
  });
}
