import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "quiet-page-session"
  )?.value;

  if (!token) {
    return null;
  }

  return await verifySession(token);
}

function createSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ─────────────────────────────────────
   GET GENRES
   ───────────────────────────────────── */

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const genres = await prisma.genre.findMany({
      orderBy: {
        name: "asc",
      },

      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return NextResponse.json({
      genres,
    });
  } catch (error) {
    console.error("Get genres error:", error);

    return NextResponse.json(
      {
        error: "Unable to load genres.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ─────────────────────────────────────
   CREATE GENRE
   ───────────────────────────────────── */

export async function POST(request: Request) {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    /* ─────────────────────────────────
       VALIDATION
       ───────────────────────────────── */

    if (!name) {
      return NextResponse.json(
        {
          error: "Genre name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: "Genre name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (description.length > 300) {
      return NextResponse.json(
        {
          error: "Genre description is too long.",
        },
        {
          status: 400,
        }
      );
    }

    /* ─────────────────────────────────
       CREATE SLUG
       ───────────────────────────────── */

    const slug = createSlug(name);

    if (!slug) {
      return NextResponse.json(
        {
          error: "Please enter a valid genre name.",
        },
        {
          status: 400,
        }
      );
    }

    /* ─────────────────────────────────
       CHECK DUPLICATES
       ───────────────────────────────── */

    const existingGenre =
      await prisma.genre.findFirst({
        where: {
          OR: [
            {
              name: {
                equals: name,
              },
            },
            {
              slug,
            },
          ],
        },
      });

    if (existingGenre) {
      return NextResponse.json(
        {
          error:
            "A genre with this name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    /* ─────────────────────────────────
       CREATE
       ───────────────────────────────── */

    const genre = await prisma.genre.create({
      data: {
        name,
        slug,
        description: description || null,
      },

      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        genre,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create genre error:", error);

    return NextResponse.json(
      {
        error: "Unable to create genre.",
      },
      {
        status: 500,
      }
    );
  }
}