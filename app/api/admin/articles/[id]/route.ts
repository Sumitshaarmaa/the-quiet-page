import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

async function requireAdmin() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("quiet-page-session")?.value;

  if (!token) {
    return null;
  }

  return await verifySession(token);
}

/* ─────────────────────────────────────
   GET ONE ARTICLE
   ───────────────────────────────────── */

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        genre: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          error: "Article not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get article error:", error);

    return NextResponse.json(
      {
        error: "Unable to load article.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ─────────────────────────────────────
   UPDATE ARTICLE
   ───────────────────────────────────── */

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

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

    const genreId =
      typeof body.genreId === "string"
        ? body.genreId.trim()
        : "";

    const type =
      typeof body.type === "string"
        ? body.type.trim()
        : "REFLECTION";

    const featured =
      body.featured === true;

    const published =
      body.published === true;

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

    const existingPost =
      await prisma.post.findUnique({
        where: {
          id,
        },
      });

    if (!existingPost) {
      return NextResponse.json(
        {
          error: "Article not found.",
        },
        {
          status: 404,
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

    if (slug !== existingPost.slug) {
      let counter = 2;

      while (
        await prisma.post.findFirst({
          where: {
            slug,
            NOT: {
              id,
            },
          },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    /* UPDATE */

    const updatedPost =
      await prisma.post.update({
        where: {
          id,
        },

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
            ? existingPost.publishedAt ??
              new Date()
            : null,
        },

        include: {
          genre: true,
        },
      });

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update article error:", error);

    return NextResponse.json(
      {
        error: "Unable to update article.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ─────────────────────────────────────
   DELETE ARTICLE
   ───────────────────────────────────── */

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          error: "Article not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete article error:", error);

    return NextResponse.json(
      {
        error: "Unable to delete article.",
      },
      {
        status: 500,
      }
    );
  }
}