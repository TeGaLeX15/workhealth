// app/server/db.ts
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Хранилище Prisma-клиента в глобальном контексте.
 *
 * Используется в development, чтобы повторное создание модулей
 * не приводило к созданию множества подключений к базе данных.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

/**
 * Экземпляр Prisma-клиента приложения.
 *
 * В development переиспользует глобальный экземпляр,
 * а в production создаётся один экземпляр на процесс.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
