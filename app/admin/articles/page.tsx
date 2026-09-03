import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

import Logo from "@/app/components/Logo";
import DeleteArticleButton from "./DeleteArticleButton";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ArticlesPage() {
  // ─────────────────────────────────────────────────────────────────────────
  // AUTHENTICATION
  // ─────────────────────────────────────────────────────────────────────────

  const cookieStore = await cookies();

  const token = cookieStore.get(
    "quiet-page-session"
  )?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = await verifySession(token);

  if (!session) {
    redirect("/admin/login");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOAD ARTICLES
  // ─────────────────────────────────────────────────────────────────────────

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      genre: true,
    },
  });

  const publishedCount = posts.filter(
    (post) => post.published
  ).length;

  const draftCount = posts.filter(
    (post) => !post.published
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#272622]">

      {/* HEADER */}

      <header className="border-b border-[#dedbd2]">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <Logo />

          <div className="flex items-center gap-6">

            <Link
              href="/admin"
              className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
            >
              ← Notebook
            </Link>

            <Link
              href="/"
              className="hidden text-sm text-[#77736a] transition-colors hover:text-[#272622] sm:block"
            >
              View site →
            </Link>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">

        {/* INTRO */}

        <div className="flex flex-col justify-between gap-10 border-b border-[#dedbd2] pb-12 md:flex-row md:items-end">

          <div>

            <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#928d82]">
              The notebook
            </p>

            <h1 className="font-serif text-5xl tracking-[-0.04em] md:text-6xl">
              Your writings.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#77736a]">
              Everything you've written for The Quiet Page,
              whether published or still waiting.
            </p>

          </div>


          <Link
            href="/admin/articles/new"
            className="group flex items-center justify-between gap-8 self-start border border-[#272622] bg-[#272622] px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-[#f5f3ed] transition hover:bg-transparent hover:text-[#272622] md:self-auto"
          >

            <span>
              New article
            </span>

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>

          </Link>

        </div>


        {/* STATS */}

        <div className="grid border-b border-[#dedbd2] md:grid-cols-3">

          <div className="border-b border-[#dedbd2] py-8 md:border-b-0 md:border-r md:pr-8">

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
              Total
            </p>

            <p className="mt-3 font-serif text-4xl">
              {posts.length}
            </p>

          </div>


          <div className="border-b border-[#dedbd2] py-8 md:border-b-0 md:border-r md:px-8">

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
              Published
            </p>

            <p className="mt-3 font-serif text-4xl">
              {publishedCount}
            </p>

          </div>


          <div className="py-8 md:pl-8">

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
              Drafts
            </p>

            <p className="mt-3 font-serif text-4xl">
              {draftCount}
            </p>

          </div>

        </div>


        {/* ARTICLES */}

        <section className="mt-12">

          {posts.length === 0 ? (

            <div className="border border-[#dedbd2] px-8 py-24 text-center">

              <p className="font-serif text-3xl">
                Your notebook is empty.
              </p>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#928d82]">
                Start with a thought, a story, a reflection,
                or whatever is waiting to be written.
              </p>

              <Link
                href="/admin/articles/new"
                className="mt-8 inline-block border-b border-[#272622] pb-2 text-[10px] uppercase tracking-[0.25em]"
              >
                Begin writing →
              </Link>

            </div>

          ) : (

            <div className="border-t border-[#dedbd2]">

              {posts.map((post, index) => (

                <article
                  key={post.id}
                  className="group border-b border-[#dedbd2] py-8 transition-all hover:px-4"
                >

                  <div className="grid gap-6 md:grid-cols-[60px_1fr_auto] md:items-center">

                    {/* NUMBER */}

                    <span className="text-[10px] text-[#aaa59a]">
                      {String(index + 1).padStart(2, "0")}
                    </span>


                    {/* ARTICLE INFO */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={`text-[9px] uppercase tracking-[0.25em] ${
                            post.published
                              ? "text-[#5f7257]"
                              : "text-[#a18455]"
                          }`}
                        >
                          {post.published
                            ? "Published"
                            : "Draft"}
                        </span>

                        <span className="h-px w-4 bg-[#c7c3b9]" />

                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#aaa59a]">
                          {post.genre.name}
                        </span>

                      </div>


                      <h2 className="mt-3 truncate font-serif text-2xl tracking-[-0.02em] md:text-3xl">
                        {post.title}
                      </h2>


                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#928d82]">

                        <span>
                          {post.type}
                        </span>

                        <span>
                          {formatDate(post.createdAt)}
                        </span>

                        {post.featured && (
                          <span className="uppercase tracking-[0.15em]">
                            Featured
                          </span>
                        )}

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex flex-wrap items-center gap-5 md:justify-end">

                      {post.published && (
                        <Link
                          href={`/post/${post.slug}`}
                          target="_blank"
                          className="text-[10px] uppercase tracking-[0.2em] text-[#928d82] transition-colors hover:text-[#272622]"
                        >
                          View
                        </Link>
                      )}


                      <Link
                        href={`/admin/articles/${post.id}/edit`}
                        className="group/edit flex items-center gap-2 border-b border-[#aaa59a] pb-1 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-[#272622]"
                      >
                        Edit

                        <span className="transition-transform duration-300 group-hover/edit:translate-x-1">
                          →
                        </span>
                      </Link>


                      <DeleteArticleButton
                        id={post.id}
                        title={post.title}
                      />

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-[#dedbd2]">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-[9px] uppercase tracking-[0.2em] text-[#aaa59a] md:flex-row lg:px-10">

          <span>
            The Quiet Page · Private
          </span>

          <span>
            Written quietly. Managed carefully.
          </span>

        </div>

      </footer>

    </main>
  );
}