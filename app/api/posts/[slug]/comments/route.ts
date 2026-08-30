import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

/* ─────────────────────────────────────
   GET COMMENTS
   ───────────────────────────────────── */

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        published: true,
      },
    });

    if (!post || !post.published) {
      return NextResponse.json(
        {
          error: "Article not found.",
        },
        {
          status: 404,
        }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
        approved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    return NextResponse.json(
      {
        error: "Unable to load thoughts.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ─────────────────────────────────────
   CREATE COMMENT
   ───────────────────────────────────── */

export async function POST(
  request: Request,
  { params }: Params
) {
  try {
    const { slug } = await params;

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (!content) {
      return NextResponse.json(
        {
          error: "Please write a thought before sharing.",
        },
        {
          status: 400,
        }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        {
          error: "Your thought is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: "Name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        published: true,
      },
    });

    if (!post || !post.published) {
      return NextResponse.json(
        {
          error: "Article not found.",
        },
        {
          status: 404,
        }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        name: name || null,
        content,
        approved: true,
        postId: post.id,
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        comment,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create comment error:", error);

    return NextResponse.json(
      {
        error: "Unable to share your thought.",
      },
      {
        status: 500,
      }
    );
  }
}