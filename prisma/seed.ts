import "dotenv/config";

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

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