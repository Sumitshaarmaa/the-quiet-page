import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://the-quiet-page-ivory.vercel.app";

  const [posts, genres] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),

    prisma.genre.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },

    ...genres.map((genre) => ({
      url: `${baseUrl}/genre/${genre.slug}`,
      lastModified: genre.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...posts.map((post) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}