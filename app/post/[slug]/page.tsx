import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import Comments from "@/app/components/Comments";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: {
      slug,
      published: true,
    },
    select: {
      title: true,
      excerpt: true,
      slug: true,
    },
  });

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const description =
    post.excerpt ||
    `Read "${post.title}" on The Quiet Page.`;

  return {
    title: post.title,
    description,

    alternates: {
      canonical: `/post/${post.slug}`,
    },

    openGraph: {
      title: post.title,
      description,
      url: `/post/${post.slug}`,
      siteName: "The Quiet Page",
      type: "article",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

function formatDate(date: Date | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getImageUrl(imagePath: string | null) {
  if (!imagePath) {
    return null;
  }

  return `/api/images?pathname=${encodeURIComponent(imagePath)}`;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      genre: true,
    },
  });

  if (!post) {
    notFound();
  }

  const paragraphs = post.content
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const imageUrl = getImageUrl(post.imageUrl);

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#272622]">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#dedbd2] bg-[#f5f3ed]/95 backdrop-blur-md">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <Link
            href="/"
            className="text-[11px] font-medium tracking-[0.28em]"
          >
            THE QUIET PAGE
          </Link>

          <Link
            href={`/genre/${encodeURIComponent(post.genre.slug)}`}
            className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
          >
            ← {post.genre.name}
          </Link>

        </div>

      </header>


      {/* ARTICLE HEADER */}

      <section className="mx-auto max-w-4xl px-6 pb-20 pt-24 md:pt-32">

        <div className="flex flex-wrap items-center gap-4 text-[9px] uppercase tracking-[0.3em] text-[#928d82]">

          <span>
            {post.type}
          </span>

          <span className="h-px w-6 bg-[#aaa59a]" />

          <span>
            {formatDate(post.publishedAt || post.createdAt)}
          </span>

        </div>


        <h1 className="mt-8 font-serif text-5xl leading-[1.05] tracking-[-0.045em] md:text-7xl lg:text-8xl">
          {post.title}
        </h1>


        {post.excerpt && (
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#77736a]">
            {post.excerpt}
          </p>
        )}

      </section>


      {/* FEATURE IMAGE */}

      {imageUrl && (
        <figure className="mx-auto max-w-6xl px-6 pb-20 lg:px-10">

          <div className="flex w-full justify-center">

            <img
              src={imageUrl}
              alt={
                post.imageAlt ||
                post.title
              }
              className="mx-auto block h-auto w-auto max-w-full"
            />

          </div>

          {post.imageCaption && (
            <figcaption className="mx-auto mt-4 max-w-3xl text-center text-xs leading-6 text-[#928d82]">
              {post.imageCaption}
            </figcaption>
          )}

        </figure>
      )}


      {/* ARTICLE CONTENT */}

      <article className="border-y border-[#dedbd2]">

        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">

          {paragraphs.map((paragraph, index) => (

            <p
              key={index}
              className="mb-8 font-serif text-xl leading-[1.8] text-[#393731] md:text-2xl"
            >
              {paragraph}
            </p>

          ))}

        </div>

      </article>


      {/* VISITOR THOUGHTS */}

      <Comments slug={post.slug} />


      {/* FOOTER */}

      <footer className="border-t border-[#dedbd2]">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">

          <Link
            href="/"
            className="font-serif text-2xl transition-opacity hover:opacity-70"
          >
            The Quiet Page
          </Link>

          <p className="mt-4 text-xs text-[#928d82]">
            Written quietly. Read slowly.
          </p>

        </div>

      </footer>

    </main>
  );
}






