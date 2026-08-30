import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

// ─────────────────────────────────────
// UPDATE GENRE
// ─────────────────────────────────────

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

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

    // Check that the genre exists.
    const existingGenre =
      await prisma.genre.findUnique({
        where: {
          id,
        },
      });

    if (!existingGenre) {
      return NextResponse.json(
        {
          error: "Genre not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Prevent duplicate genre names.
    const duplicateName =
      await prisma.genre.findFirst({
        where: {
          name,
          NOT: {
            id,
          },
        },
      });

    if (duplicateName) {
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

    // Create a new slug from the updated name.
    const baseSlug = name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    let slug =
      baseSlug || `genre-${Date.now()}`;

    let counter = 2;

    while (true) {
      const existingSlug =
        await prisma.genre.findFirst({
          where: {
            slug,
            NOT: {
              id,
            },
          },
        });

      if (!existingSlug) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const genre = await prisma.genre.update({
      where: {
        id,
      },
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

    return NextResponse.json({
      success: true,
      genre,
    });
  } catch (error) {
    console.error("Update genre error:", error);

    return NextResponse.json(
      {
        error: "Unable to update genre.",
      },
      {
        status: 500,
      }
    );
  }
}

// ─────────────────────────────────────
// DELETE GENRE
// ─────────────────────────────────────

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
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

    const { id } = await params;

    const genre =
      await prisma.genre.findUnique({
        where: {
          id,
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

    if (!genre) {
      return NextResponse.json(
        {
          error: "Genre not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Do not delete genres that have articles.
    if (genre._count.posts > 0) {
      return NextResponse.json(
        {
          error: `This genre cannot be deleted because it is being used by ${genre._count.posts} article${
            genre._count.posts === 1
              ? ""
              : "s"
          }.`,
        },
        {
          status: 409,
        }
      );
    }

    await prisma.genre.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete genre error:", error);

    return NextResponse.json(
      {
        error: "Unable to delete genre.",
      },
      {
        status: 500,
      }
    );
  }
}