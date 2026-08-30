import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MobileMenu from "@/app/components/MobileMenu";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function Home() {
  const [posts, genres] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        genre: true,
      },
    }),

    prisma.genre.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const featuredPosts = posts.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#272622] selection:bg-[#272622] selection:text-[#f5f3ed]">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#dedbd2]/70 bg-[#f5f3ed]/90 backdrop-blur-md">

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


          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-10 md:flex">

            <a
              href="#featured"
              className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
            >
              Writings
            </a>

            <a
              href="#genres"
              className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
            >
              Notebook
            </a>

            <a
              href="#about"
              className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
            >
              About
            </a>

          </nav>


          {/* SEARCH + MOBILE MENU */}

          <div className="flex items-center gap-3">

            {/* DESKTOP SEARCH */}

            <Link
              href="/search"
              aria-label="Search"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#d5d1c7] text-lg text-[#77736a] transition-all hover:border-[#272622] hover:text-[#272622] md:flex"
            >
              ⌕
            </Link>


            {/* MOBILE MENU */}

            <MobileMenu />

          </div>

        </div>

      </header>


      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center lg:px-10">

          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.45em] text-[#928d82]">
            A personal collection of words
          </p>

          <h1 className="font-serif text-[clamp(4.5rem,12vw,10rem)] font-normal leading-[0.78] tracking-[-0.065em]">

            The

            <br />

            <span className="ml-[0.7em]">
              Quiet
            </span>

            <br />

            Page

          </h1>


          <div className="mt-14 flex max-w-xl items-start gap-5 text-left">

            <span className="mt-2 h-px w-10 shrink-0 bg-[#aaa59a]" />

            <p className="text-sm leading-7 text-[#77736a] md:text-base">
              Thoughts, stories, ideas and observations — written down before
              they disappear.
            </p>

          </div>


          <a
            href="#featured"
            className="mt-16 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-[#77736a] transition-colors hover:text-[#272622]"
          >
            Explore the page

            <span className="text-base">
              ↓
            </span>

          </a>

        </div>


        <div className="absolute left-5 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[9px] uppercase tracking-[0.4em] text-[#aaa59a] lg:block">
          EST. 2026 · A PLACE TO WRITE
        </div>


        <div className="absolute right-5 top-1/2 hidden translate-x-1/2 -rotate-90 text-[9px] uppercase tracking-[0.4em] text-[#aaa59a] lg:block">
          READ · THINK · REFLECT
        </div>

      </section>


      {/* NOTE */}

      <section className="border-y border-[#dedbd2]">

        <div className="mx-auto grid max-w-7xl md:grid-cols-[220px_1fr]">

          <div className="border-b border-[#dedbd2] p-8 md:border-b-0 md:border-r lg:p-10">

            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#928d82]">
              A note
            </p>

            <p className="mt-3 text-xs text-[#aaa59a]">
              From the page
            </p>

          </div>


          <div className="flex min-h-[280px] items-center p-8 lg:p-16">

            <div className="max-w-3xl">

              <span className="mb-8 block font-serif text-5xl text-[#d4d0c6]">
                “
              </span>

              <blockquote className="font-serif text-2xl leading-[1.5] tracking-[-0.02em] md:text-4xl lg:text-[2.8rem]">
                Some thoughts don't need an answer. They just need somewhere
                to exist.
              </blockquote>

              <div className="mt-10 flex items-center gap-4">

                <span className="h-px w-8 bg-[#aaa59a]" />

                <span className="text-[10px] uppercase tracking-[0.25em] text-[#77736a]">
                  Sumit
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURED */}

      <section
        id="featured"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"
      >

        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-[#928d82]">
              Selected writings
            </p>

            <h2 className="font-serif text-5xl tracking-[-0.04em] md:text-6xl">
              Featured
            </h2>

          </div>

          <p className="max-w-xs text-sm leading-6 text-[#928d82]">
            A few pages I'd like you to read first.
          </p>

        </div>


        {featuredPosts.length === 0 ? (

          <div className="border border-[#dedbd2] px-8 py-20 text-center">

            <p className="font-serif text-3xl">
              Nothing has been published yet.
            </p>

            <p className="mt-4 text-sm text-[#928d82]">
              New writings will appear here when they are published.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 lg:grid-cols-2">

            {/* MAIN FEATURED */}

            <Link
              href={`/post/${featuredPosts[0].slug}`}
              className="group relative flex min-h-[520px] flex-col justify-between overflow-hidden bg-[#292824] p-8 text-[#f5f3ed] transition-transform duration-500 hover:-translate-y-1 md:p-12"
            >

              <div className="flex items-start justify-between">

                <span className="text-[10px] tracking-[0.3em] text-[#aaa59a]">
                  01
                </span>

                <span className="text-[10px] tracking-[0.25em] text-[#aaa59a]">
                  {featuredPosts[0].type}
                </span>

              </div>


              <div>

                {featuredPosts[0].excerpt && (
                  <p className="mb-6 max-w-md text-sm leading-7 text-[#bdb9af]">
                    {featuredPosts[0].excerpt}
                  </p>
                )}

                <h3 className="max-w-xl font-serif text-4xl leading-[1.05] tracking-[-0.03em] md:text-5xl">
                  {featuredPosts[0].title}
                </h3>


                <div className="mt-10 flex items-center justify-between border-t border-[#ffffff20] pt-5">

                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#aaa59a]">
                    {formatDate(
                      featuredPosts[0].publishedAt ||
                      featuredPosts[0].createdAt
                    )}
                  </span>

                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                    Read →
                  </span>

                </div>

              </div>

            </Link>


            {/* OTHER FEATURED */}

            <div className="grid gap-5 sm:grid-cols-2">

              {featuredPosts.slice(1).map((post, index) => (

                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="group flex min-h-[248px] flex-col justify-between border border-[#dedbd2] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#aaa59a] hover:bg-[#eeece5]"
                >

                  <div className="flex justify-between">

                    <span className="text-[10px] tracking-[0.25em] text-[#aaa59a]">
                      {String(index + 2).padStart(2, "0")}
                    </span>

                    <span className="text-[9px] tracking-[0.2em] text-[#928d82]">
                      {post.type}
                    </span>

                  </div>


                  <div>

                    <h3 className="font-serif text-2xl leading-tight tracking-[-0.02em]">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 line-clamp-2 text-xs leading-6 text-[#807c73]">
                        {post.excerpt}
                      </p>
                    )}


                    <div className="mt-6 flex items-center justify-between text-[10px] text-[#928d82]">

                      <span>
                        {formatDate(
                          post.publishedAt ||
                          post.createdAt
                        )}
                      </span>

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        )}

      </section>


      {/* GENRES */}

      <section
        id="genres"
        className="border-y border-[#dedbd2] bg-[#ebe9e1]"
      >

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">

          <div className="mb-16 max-w-xl">

            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-[#928d82]">
              The notebook
            </p>

            <h2 className="font-serif text-5xl tracking-[-0.04em] md:text-6xl">
              Explore by genre
            </h2>

            <p className="mt-6 text-sm leading-7 text-[#77736a]">
              Different places for different kinds of thoughts. These sections
              will grow as the notebook does.
            </p>

          </div>


          <div className="border-t border-[#d2cfc5]">

            {genres.map((genre, index) => (

              <Link
                key={genre.id}
                href={`/genre/${encodeURIComponent(genre.slug)}`}
                className="group grid grid-cols-[50px_1fr_auto] items-center gap-5 border-b border-[#d2cfc5] py-7 transition-all hover:px-4 md:grid-cols-[70px_1fr_1fr_auto]"
              >

                <span className="text-[10px] text-[#aaa59a]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="font-serif text-2xl md:text-3xl">
                  {genre.name}
                </span>

                <span className="hidden text-sm text-[#928d82] md:block">
                  {genre.description}
                </span>

                <span className="text-lg text-[#aaa59a] transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#272622]">
                  →
                </span>

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* THOUGHT INVITATION */}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">

        <div className="relative overflow-hidden border border-[#dedbd2] px-7 py-20 text-center md:px-16">

          <span className="absolute left-5 top-5 font-serif text-6xl text-[#dedbd2]">
            “
          </span>

          <span className="absolute bottom-0 right-5 font-serif text-6xl text-[#dedbd2]">
            ”
          </span>

          <p className="text-[10px] uppercase tracking-[0.35em] text-[#928d82]">
            After reading
          </p>

          <h2 className="mx-auto mt-6 max-w-2xl font-serif text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
            Perhaps you have a thought of your own.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#77736a]">
            Every page is open to another perspective. Read something, think
            about it, and leave a thought if you want to.
          </p>

          <a
            href="#featured"
            className="mt-10 inline-block border-b border-[#272622] pb-2 text-[10px] uppercase tracking-[0.25em] transition-all hover:pr-3"
          >
            Explore the writings →
          </a>

        </div>

      </section>


      {/* FOOTER */}

      <footer
        id="about"
        className="border-t border-[#dedbd2] bg-[#292824] text-[#f5f3ed]"
      >

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">

          <div className="flex flex-col justify-between gap-16 md:flex-row">

            <div>

              <p className="font-serif text-3xl">
                The Quiet Page
              </p>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#aaa59a]">
                A small corner of the internet for thoughts, stories,
                reflections and everything in between.
              </p>

            </div>


            <div className="flex gap-16 text-sm">

              <div>

                <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-[#77736a]">
                  Explore
                </p>

                <div className="space-y-3 text-[#bdb9af]">

                  <a
                    href="#featured"
                    className="block hover:text-white"
                  >
                    Writings
                  </a>

                  <a
                    href="#genres"
                    className="block hover:text-white"
                  >
                    Genres
                  </a>

                  <a
                    href="#about"
                    className="block hover:text-white"
                  >
                    About
                  </a>

                  <Link
                    href="/search"
                    className="block hover:text-white"
                  >
                    Search
                  </Link>

                </div>

              </div>

            </div>

          </div>


          <div className="mt-16 flex flex-col justify-between gap-4 border-t border-[#ffffff15] pt-6 text-[10px] uppercase tracking-[0.2em] text-[#77736a] md:flex-row">

            <span>
              © 2026 The Quiet Page
            </span>

            <span>
              Written quietly. Read slowly.
            </span>

          </div>

        </div>

      </footer>

    </main>
  );
}