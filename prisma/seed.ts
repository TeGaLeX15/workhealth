// prisma/seed.ts

import "dotenv/config";

import { PrismaClient } from "../app/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

/**
 * Начальный набор упражнений для заполнения базы данных.
 */
const exercises = [
  {
    name: "Подтягивания",
    slug: "pull-ups",
  },
  {
    name: "Отжимания от пола",
    slug: "push-ups",
  },
  {
    name: "Отжимания на брусьях",
    slug: "dips",
  },
  {
    name: "Приседания",
    slug: "squats",
  },
];

/**
 * Заполняет базу данных начальными упражнениями.
 *
 * Для каждого упражнения используется `upsert`:
 * если упражнение с таким `slug` уже существует, его название
 * обновляется; в противном случае создаётся новая запись.
 *
 * @returns Promise, который завершается после заполнения базы данных.
 */
async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: {
        slug: exercise.slug,
      },
      update: {
        name: exercise.name,
      },
      create: exercise,
    });
  }

  console.log("Exercises seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
