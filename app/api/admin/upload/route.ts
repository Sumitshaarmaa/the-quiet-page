import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";

import { verifySession } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("quiet-page-session")?.value;

  if (!token) {
    return null;
  }

  return await verifySession(token);
}

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

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Please select an image.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported image type. Please use JPG, PNG, WebP, or GIF.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Image must be 10 MB or smaller.",
        },
        {
          status: 400,
        }
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const pathname =
      `articles/${crypto.randomUUID()}.${extension}`;

    const blob = await put(pathname, file, {
      access: "private",
      addRandomSuffix: false,
      contentType: file.type,
    });

    return NextResponse.json(
      {
        success: true,

        // We store the pathname in Post.imageUrl.
        // The public image route will use this pathname
        // to retrieve the private Blob securely.
        pathname: blob.pathname,

        contentType: blob.contentType,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      {
        error: "Unable to upload image.",
      },
      {
        status: 500,
      }
    );
  }
}