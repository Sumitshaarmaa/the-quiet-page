import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

type Params = {
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

/* ─────────────────────────────────────
   UPDATE COMMENT
   ───────────────────────────────────── */

export async function PATCH(
  request: Request,
  { params }: Params
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

    const body = await request.json();

    if (typeof body.approved !== "boolean") {
      return NextResponse.json(
        {
          error: "Approved status is required.",
        },
        {
          status: 400,
        }
      );
    }

    const existingComment =
      await prisma.comment.findUnique({
        where: {
          id,
        },
      });

    if (!existingComment) {
      return NextResponse.json(
        {
          error: "Comment not found.",
        },
        {
          status: 404,
        }
      );
    }

    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data: {
        approved: body.approved,
      },
    });

    return NextResponse.json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Update comment error:", error);

    return NextResponse.json(
      {
        error: "Unable to update comment.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ─────────────────────────────────────
   DELETE COMMENT
   ───────────────────────────────────── */

export async function DELETE(
  request: Request,
  { params }: Params
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

    const existingComment =
      await prisma.comment.findUnique({
        where: {
          id,
        },
      });

    if (!existingComment) {
      return NextResponse.json(
        {
          error: "Comment not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.comment.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return NextResponse.json(
      {
        error: "Unable to delete comment.",
      },
      {
        status: 500,
      }
    );
  }
}