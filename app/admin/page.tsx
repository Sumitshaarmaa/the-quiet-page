import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import Logo from "@/app/components/Logo";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminPage() {
  // ─────────────────────────────────────
  // AUTHENTICATION
  // ─────────────────────────────────────

  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    "quiet-page-session"
  )?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  const session = await verifySession(sessionToken);

  if (!session) {
    redirect("/admin/login");
  }

  // ─────────────────────────────────────
  // LOAD DASHBOARD DATA
  // ─────────────────────────────────────

  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    totalGenres,
    totalComments,
    approvedComments,
    pendingComments,
    recentArticles,
    recentComments,
  ] = await Promise.all([
    prisma.post.count(),

    prisma.post.count({
      where: {
        published: true,
      },
    }),

    prisma.post.count({
      where: {
        published: false,
      },
    }),

    prisma.genre.count(),

    prisma.comment.count(),

    prisma.comment.count({
      where: {
        approved: true,
      },
    }),

    prisma.comment.count({
      where: {
        approved: false,
      },
    }),

    prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        genre: true,
      },
    }),

    prisma.comment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#272622]">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#dedbd2] bg-[#f5f3ed]/95 backdrop-blur-sm">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <Logo />

          <div className="flex items-center gap-6">

            <span className="hidden text-[9px] uppercase tracking-[0.25em] text-[#aaa59a] sm:block">
              Private space
            </span>

            <Link
              href="/"
              className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
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
              The quiet side
            </p>

            <h1 className="font-serif text-5xl tracking-[-0.04em] md:text-6xl">
              Your notebook.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#77736a]">
              Write something new, organise your thoughts,
              and decide what becomes part of The Quiet Page.
            </p>

          </div>


          <div className="text-right">

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
              Status
            </p>

            <p className="mt-2 text-sm">
              Private · Secure
            </p>

          </div>

        </div>


        {/* OVERVIEW */}

        <section className="border-b border-[#dedbd2] py-12">

          <div className="mb-7">

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#928d82]">
              Overview
            </p>

          </div>


          <div className="grid border-t border-[#dedbd2] md:grid-cols-4">

            {/* ARTICLES */}

            <Link
              href="/admin/articles"
              className="border-b border-[#dedbd2] py-8 transition-all hover:px-3 md:border-b-0 md:border-r md:pr-8"
            >

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
                Articles
              </p>

              <p className="mt-3 font-serif text-4xl">
                {totalArticles}
              </p>

              <p className="mt-2 text-xs text-[#928d82]">
                {publishedArticles} published · {draftArticles} drafts
              </p>

            </Link>


            {/* GENRES */}

            <Link
              href="/admin/genres"
              className="border-b border-[#dedbd2] py-8 transition-all hover:px-3 md:border-b-0 md:border-r md:px-8"
            >

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
                Genres
              </p>

              <p className="mt-3 font-serif text-4xl">
                {totalGenres}
              </p>

              <p className="mt-2 text-xs text-[#928d82]">
                Writing homes
              </p>

            </Link>


            {/* THOUGHTS */}

            <Link
              href="/admin/comments"
              className="border-b border-[#dedbd2] py-8 transition-all hover:px-3 md:border-b-0 md:border-r md:px-8"
            >

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
                Reader thoughts
              </p>

              <p className="mt-3 font-serif text-4xl">
                {totalComments}
              </p>

              <p className="mt-2 text-xs text-[#928d82]">
                {approvedComments} visible · {pendingComments} hidden
              </p>

            </Link>


            {/* PUBLISHED */}

            <div className="py-8 md:pl-8">

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
                Published
              </p>

              <p className="mt-3 font-serif text-4xl">
                {publishedArticles}
              </p>

              <p className="mt-2 text-xs text-[#928d82]">
                Live on the site
              </p>

            </div>

          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="py-12">

          <div className="mb-7">

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#928d82]">
              Create
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* NEW ARTICLE */}

            <Link
              href="/admin/articles/new"
              className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden bg-[#292824] p-8 text-[#f5f3ed] transition-transform duration-300 hover:-translate-y-1 md:p-10"
            >

              <div className="flex items-start justify-between">

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffffff35] text-xl">
                  +
                </span>

                <span className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
                  Writing
                </span>

              </div>

              <div>

                <h2 className="font-serif text-3xl tracking-[-0.03em]">
                  New article
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-[#aaa59a]">
                  Start a new piece and choose which part
                  of the notebook it belongs to.
                </p>

                <div className="mt-7 text-[10px] uppercase tracking-[0.25em]">
                  Begin writing

                  <span className="ml-3 transition-all duration-300 group-hover:ml-5">
                    →
                  </span>

                </div>

              </div>

            </Link>


            {/* NEW GENRE */}

            <Link
              href="/admin/genres"
              className="group relative flex min-h-[240px] flex-col justify-between border border-[#d5d1c7] p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-[#ebe9e1] md:p-10"
            >

              <div className="flex items-start justify-between">

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#aaa59a] text-xl">
                  +
                </span>

                <span className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
                  Notebook
                </span>

              </div>

              <div>

                <h2 className="font-serif text-3xl tracking-[-0.03em]">
                  New genre
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-[#77736a]">
                  Create a new space for a particular kind
                  of writing.
                </p>

                <div className="mt-7 text-[10px] uppercase tracking-[0.25em]">
                  Create genre

                  <span className="ml-3 transition-all duration-300 group-hover:ml-5">
                    →
                  </span>

                </div>

              </div>

            </Link>

          </div>

        </section>


        {/* RECENT ACTIVITY */}

        <section className="border-t border-[#dedbd2] py-12">

          <div className="mb-8">

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#928d82]">
              Recent activity
            </p>

          </div>


          <div className="grid gap-12 md:grid-cols-2">

            {/* RECENT ARTICLES */}

            <div>

              <div className="mb-5 flex items-center justify-between">

                <h2 className="font-serif text-2xl">
                  Recent writings
                </h2>

                <Link
                  href="/admin/articles"
                  className="text-[9px] uppercase tracking-[0.2em] text-[#928d82] hover:text-[#272622]"
                >
                  All →
                </Link>

              </div>


              {recentArticles.length === 0 ? (

                <p className="border-t border-[#dedbd2] py-7 text-sm text-[#928d82]">
                  No writings yet.
                </p>

              ) : (

                <div className="border-t border-[#dedbd2]">

                  {recentArticles.map((post, index) => (

                    <Link
                      key={post.id}
                      href={`/admin/articles/${post.id}/edit`}
                      className="group flex items-center justify-between gap-5 border-b border-[#dedbd2] py-5"
                    >

                      <div className="flex min-w-0 items-center gap-5">

                        <span className="text-[9px] text-[#aaa59a]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0">

                          <p className="truncate font-serif text-lg">
                            {post.title}
                          </p>

                          <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#aaa59a]">
                            {post.genre.name} ·{" "}
                            {post.published
                              ? "Published"
                              : "Draft"}
                          </p>

                        </div>

                      </div>

                      <span className="shrink-0 text-[9px] text-[#aaa59a]">
                        {formatDate(post.createdAt)}
                      </span>

                    </Link>

                  ))}

                </div>

              )}

            </div>


            {/* RECENT COMMENTS */}

            <div>

              <div className="mb-5 flex items-center justify-between">

                <h2 className="font-serif text-2xl">
                  Reader thoughts
                </h2>

                <Link
                  href="/admin/comments"
                  className="text-[9px] uppercase tracking-[0.2em] text-[#928d82] hover:text-[#272622]"
                >
                  All →
                </Link>

              </div>


              {recentComments.length === 0 ? (

                <p className="border-t border-[#dedbd2] py-7 text-sm text-[#928d82]">
                  No reader thoughts yet.
                </p>

              ) : (

                <div className="border-t border-[#dedbd2]">

                  {recentComments.map((comment) => (

                    <Link
                      key={comment.id}
                      href="/admin/comments"
                      className="group block border-b border-[#dedbd2] py-5"
                    >

                      <div className="flex items-center justify-between gap-5">

                        <p className="text-xs font-medium">
                          {comment.name?.trim()
                            ? comment.name
                            : "Anonymous"}
                        </p>

                        <span
                          className={`text-[9px] uppercase tracking-[0.15em] ${
                            comment.approved
                              ? "text-[#5f7257]"
                              : "text-[#a18455]"
                          }`}
                        >
                          {comment.approved
                            ? "Visible"
                            : "Hidden"}
                        </span>

                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#77736a]">
                        {comment.content}
                      </p>

                      <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-[#aaa59a]">
                        On: {comment.post.title}
                      </p>

                    </Link>

                  ))}

                </div>

              )}

            </div>

          </div>

        </section>


        {/* MANAGEMENT */}

        <section className="border-t border-[#dedbd2] py-12">

          <div className="mb-8">

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#928d82]">
              Manage
            </p>

          </div>


          <div className="divide-y divide-[#dedbd2] border-y border-[#dedbd2]">

            {/* ARTICLES */}

            <Link
              href="/admin/articles"
              className="group flex items-center justify-between py-7 transition-all hover:px-4"
            >

              <div className="flex items-center gap-7">

                <span className="text-[10px] text-[#aaa59a]">
                  01
                </span>

                <div>

                  <h3 className="font-serif text-2xl">
                    Articles
                  </h3>

                  <p className="mt-1 text-xs text-[#928d82]">
                    Create, edit and remove your writings.
                  </p>

                </div>

              </div>

              <span className="text-lg text-[#aaa59a] transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#272622]">
                →
              </span>

            </Link>


            {/* GENRES */}

            <Link
              href="/admin/genres"
              className="group flex items-center justify-between py-7 transition-all hover:px-4"
            >

              <div className="flex items-center gap-7">

                <span className="text-[10px] text-[#aaa59a]">
                  02
                </span>

                <div>

                  <h3 className="font-serif text-2xl">
                    Genres
                  </h3>

                  <p className="mt-1 text-xs text-[#928d82]">
                    Organise the different sections of your notebook.
                  </p>

                </div>

              </div>

              <span className="text-lg text-[#aaa59a] transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#272622]">
                →
              </span>

            </Link>


            {/* COMMENTS */}

            <Link
              href="/admin/comments"
              className="group flex items-center justify-between py-7 transition-all hover:px-4"
            >

              <div className="flex items-center gap-7">

                <span className="text-[10px] text-[#aaa59a]">
                  03
                </span>

                <div>

                  <h3 className="font-serif text-2xl">
                    Reader thoughts
                  </h3>

                  <p className="mt-1 text-xs text-[#928d82]">
                    Read, hide and delete thoughts left by visitors.
                  </p>

                </div>

              </div>

              <span className="text-lg text-[#aaa59a] transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#272622]">
                →
              </span>

            </Link>

          </div>

        </section>


        {/* ACCOUNT */}

        <section className="border-t border-[#dedbd2] pt-10">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
                Signed in as
              </p>

              <p className="mt-2 text-sm">
                Administrator
              </p>

            </div>

            <Link
              href="/admin/logout"
              className="text-[10px] uppercase tracking-[0.25em] text-[#77736a] transition-colors hover:text-[#272622]"
            >
              Sign out →
            </Link>

          </div>

        </section>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-[#dedbd2]">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-[9px] uppercase tracking-[0.2em] text-[#aaa59a] md:flex-row lg:flex-row lg:px-10">

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