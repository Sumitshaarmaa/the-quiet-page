import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    genre: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function GenrePage({ params }: Props) {
  const { genre } = await params;

  const slug = decodeURIComponent(genre);

  const currentGenre = await prisma.genre.findUnique({
    where: {
      slug,
    },
  });

  if (!currentGenre) {
    notFound();
  }

  const genrePosts = await prisma.post.findMany({
    where: {
      genreId: currentGenre.id,
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#272622]">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#dedbd2] bg-[#f5f3ed]/95 backdrop-blur">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#272622] text-xs transition-transform duration-300 group-hover:rotate-45">
              T
            </span>

            <span className="text-[11px] font-medium tracking-[0.28em]">
              THE QUIET PAGE
            </span>
          </Link>

          <div className="flex items-center gap-6">

            <Link
              href="/"
              className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
            >
              ← Home
            </Link>

            <Link
              href="/#genres"
              className="hidden text-sm text-[#77736a] transition-colors hover:text-[#272622] sm:block"
            >
              All genres →
            </Link>

          </div>

        </div>

      </header>


      {/* INTRO */}

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-10 lg:pb-28 lg:pt-32">

        <div className="border-b border-[#dedbd2] pb-12">

          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.35em] text-[#928d82]">
            The notebook
          </p>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>

              <h1 className="font-serif text-5xl tracking-[-0.045em] md:text-7xl">
                {currentGenre.name}
              </h1>

              {currentGenre.description && (
                <p className="mt-6 max-w-2xl text-sm leading-7 text-[#77736a]">
                  {currentGenre.description}
                </p>
              )}

            </div>

            <div className="text-[10px] uppercase tracking-[0.25em] text-[#aaa59a]">
              {genrePosts.length}{" "}
              {genrePosts.length === 1 ? "writing" : "writings"}
            </div>

          </div>

        </div>

      </section>


      {/* WRITINGS */}

      <section className="border-y border-[#dedbd2] bg-[#ebe9e1]">

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">

          {genrePosts.length === 0 ? (

            <div className="border border-[#d8d5cc] px-8 py-24 text-center">

              <p className="font-serif text-3xl">
                Nothing here yet.
              </p>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#928d82]">
                This space is waiting for something to be written.
              </p>

            </div>

          ) : (

            <div className="border-t border-[#d2cfc5]">

              {genrePosts.map((post, index) => (

                <Link
                  key={post.id}
                  href={`/post/${encodeURIComponent(post.slug)}`}
                  className="group grid gap-6 border-b border-[#d2cfc5] py-10 transition-all duration-300 hover:px-4 md:grid-cols-[70px_1fr_220px_auto] md:items-center"
                >

                  {/* NUMBER */}

                  <span className="text-[10px] text-[#aaa59a]">
                    {String(index + 1).padStart(2, "0")}
                  </span>


                  {/* TITLE */}

                  <div>

                    <div className="mb-3 flex items-center gap-3">

                      <span className="text-[9px] uppercase tracking-[0.25em] text-[#928d82]">
                        {post.type}
                      </span>

                      <span className="h-px w-4 bg-[#c7c3b9]" />

                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#aaa59a]">
                        {formatDate(
                          post.publishedAt || post.createdAt
                        )}
                      </span>

                    </div>

                    <h2 className="font-serif text-3xl tracking-[-0.025em] md:text-4xl">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77736a]">
                        {post.excerpt}
                      </p>
                    )}

                  </div>


                  {/* DESCRIPTION SPACE */}

                  <div className="hidden text-sm leading-7 text-[#928d82] md:block">
                    Read slowly. Stay awhile.
                  </div>


                  {/* ARROW */}

                  <span className="text-lg text-[#aaa59a] transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#272622]">
                    →
                  </span>

                </Link>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* BACK TO NOTEBOOK */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">

        <div className="flex flex-col justify-between gap-8 border-t border-[#dedbd2] pt-10 md:flex-row md:items-center">

          <div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#928d82]">
              Continue exploring
            </p>

            <p className="mt-3 font-serif text-2xl">
              Find another place for your thoughts.
            </p>

          </div>

          <Link
            href="/#genres"
            className="self-start border-b border-[#272622] pb-2 text-[10px] uppercase tracking-[0.25em] transition-all hover:pr-3 md:self-auto"
          >
            Explore all genres →
          </Link>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-[#dedbd2]">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-10 text-[9px] uppercase tracking-[0.2em] text-[#aaa59a] md:flex-row lg:px-10">

          <span>
            © 2026 The Quiet Page
          </span>

          <span>
            Written quietly. Read slowly.
          </span>

        </div>

      </footer>

    </main>
  );
}