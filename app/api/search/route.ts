import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json({
        posts: [],
      });
    }

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            excerpt: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
        ],
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 20,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        excerpt: true,
        publishedAt: true,
        createdAt: true,
        genre: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      posts,
    });
  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json(
      {
        error: "Unable to search writings.",
      },
      {
        status: 500,
      }
    );
  }
}