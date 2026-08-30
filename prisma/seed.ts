import "dotenv/config";
import bcrypt from "bcryptjs";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString =
  process.env.DATABASE_URL || "file:./dev.db";

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // ─────────────────────────────────────
  // ADMIN ACCOUNT
  // ─────────────────────────────────────

  const email =
    process.env.ADMIN_EMAIL || "admin@thequietpage.com";

  const password =
    process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: {
      email,
    },

    update: {
      passwordHash,
    },

    create: {
      email,
      passwordHash,
    },
  });

  // ─────────────────────────────────────
  // GENRES
  // ─────────────────────────────────────

  const genres = [
    {
      name: "Reflections",
      slug: "reflections",
      description:
        "Personal observations and things worth sitting with.",
    },

    {
      name: "Stories",
      slug: "stories",
      description:
        "Moments, memories, fiction, and things that happened.",
    },

    {
      name: "Longform",
      slug: "longform",
      description:
        "Longer pieces, slowly unfolded.",
    },

    {
      name: "Fragments",
      slug: "fragments",
      description:
        "Half-formed ideas, observations, and pieces of something.",
    },

    {
      name: "Notes",
      slug: "notes",
      description:
        "Small things that deserve a place on the page.",
    },
  ];

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: {
        slug: genre.slug,
      },

      update: {
        name: genre.name,
        description: genre.description,
      },

      create: genre,
    });
  }

  console.log("");
  console.log("✓ The Quiet Page database has been seeded.");
  console.log("");
  console.log(`Admin email: ${email}`);
  console.log(
    "Genres created: Reflections, Stories, Longform, Fragments, Notes"
  );
  console.log("");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });