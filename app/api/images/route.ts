import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const value = url.searchParams.get("pathname");

    if (!value) {
      return NextResponse.json(
        { error: "Image pathname is required." },
        { status: 400 }
      );
    }

    let pathname = value;

    // Accept either:
    // articles/abc.jpg
    // OR a full Vercel Blob URL.
    if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
      try {
        const blobUrl = new URL(pathname);
        pathname = blobUrl.pathname.replace(/^\/+/, "");
      } catch {
        return NextResponse.json(
          { error: "Invalid image URL." },
          { status: 400 }
        );
      }
    }

    if (!pathname.startsWith("articles/")) {
      return NextResponse.json(
        { error: "Invalid image pathname." },
        { status: 400 }
      );
    }

    const result = await get(pathname, {
      access: "private",
    });

    if (!result || !result.stream) {
      return NextResponse.json(
        { error: "Image not found." },
        { status: 404 }
      );
    }

    return new Response(result.stream, {
      headers: {
        "Content-Type":
          result.blob.contentType || "application/octet-stream",
        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image retrieval error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve image." },
      { status: 500 }
    );
  }
}
