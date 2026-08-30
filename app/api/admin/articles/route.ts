import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("quiet-page-session")?.value;

  if (!token) {
    return null;
  }

  return await verifySession(token);
}

/* ─────────────────────────────────────
   GET ARTICLES + GENRES
   ───────────────────────────────────── */

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const [genres, posts] = await Promise.all([
      prisma.genre.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      }),

      prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          genre: true,
        },
      }),
    ]);

    return NextResponse.json({
      genres,
      posts,
    });
  } catch (error) {
    console.error("Get articles error:", error);

    return NextResponse.json(
      {
        error: "Unable to load articles.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ─────────────────────────────────────
   CREATE ARTICLE
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

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const excerpt =
      typeof body.excerpt === "string"
        ? body.excerpt.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    const type =
      typeof body.type === "string"
        ? body.type.trim()
        : "REFLECTION";

    const genreId =
      typeof body.genreId === "string"
        ? body.genreId.trim()
        : "";

    const published =
      body.published === true;

    const featured =
      body.featured === true;

    if (!title) {
      return NextResponse.json(
        {
          error: "Title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          error: "Article content is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!genreId) {
      return NextResponse.json(
        {
          error: "Please choose a genre.",
        },
        {
          status: 400,
        }
      );
    }

    const genre = await prisma.genre.findUnique({
      where: {
        id: genreId,
      },
    });

    if (!genre) {
      return NextResponse.json(
        {
          error: "Selected genre does not exist.",
        },
        {
          status: 400,
        }
      );
    }

    /* SLUG */

    const baseSlug =
      title
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") ||
      `article-${Date.now()}`;

    let slug = baseSlug;

    let counter = 2;

    while (
      await prisma.post.findUnique({
        where: {
          slug,
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    /* CREATE */

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        type,
        excerpt: excerpt || null,
        content,
        featured,
        published,
        genreId: genre.id,
        publishedAt: published
          ? new Date()
          : null,
      },

      include: {
        genre: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        post,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create article error:", error);

    return NextResponse.json(
      {
        error: "Unable to create article.",
      },
      {
        status: 500,
      }
    );
  }
}