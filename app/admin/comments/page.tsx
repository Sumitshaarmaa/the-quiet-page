import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import CommentActions from "./CommentActions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function CommentsPage() {
  // ─────────────────────────────────────
  // AUTHENTICATION
  // ─────────────────────────────────────

  const cookieStore = await cookies();

  const token = cookieStore.get(
    "quiet-page-session"
  )?.value;

  if (!token) {
    redirect("/admin/login");
  }

  // ─────────────────────────────────────
  // LOAD COMMENTS
  // ─────────────────────────────────────

  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  const totalCount = comments.length;

  const approvedCount = comments.filter(
    (comment) => comment.approved
  ).length;

  const pendingCount = comments.filter(
    (comment) => !comment.approved
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#272622]">

      {/* HEADER */}

      <header className="border-b border-[#dedbd2]">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <Link
            href="/admin"
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
              href="/admin"
              className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
            >
              ← Notebook
            </Link>

            <Link
              href="/admin/articles"
              className="hidden text-sm text-[#77736a] transition-colors hover:text-[#272622] sm:block"
            >
              Articles →
            </Link>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">

        {/* INTRO */}

        <div className="border-b border-[#dedbd2] pb-12">

          <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#928d82]">
            Reader thoughts
          </p>

          <h1 className="font-serif text-5xl tracking-[-0.04em] md:text-6xl">
            What readers left behind.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#77736a]">
            Manage the thoughts readers leave on your
            writings.
          </p>

        </div>


        {/* STATS */}

        <div className="grid border-b border-[#dedbd2] md:grid-cols-3">

          <div className="border-b border-[#dedbd2] py-8 md:border-b-0 md:border-r md:pr-8">

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
              Total
            </p>

            <p className="mt-3 font-serif text-4xl">
              {totalCount}
            </p>

          </div>


          <div className="border-b border-[#dedbd2] py-8 md:border-b-0 md:border-r md:px-8">

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
              Approved
            </p>

            <p className="mt-3 font-serif text-4xl">
              {approvedCount}
            </p>

          </div>


          <div className="py-8 md:pl-8">

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#aaa59a]">
              Pending
            </p>

            <p className="mt-3 font-serif text-4xl">
              {pendingCount}
            </p>

          </div>

        </div>


        {/* COMMENTS */}

        <section className="mt-12">

          {comments.length === 0 ? (

            <div className="border border-[#dedbd2] px-8 py-24 text-center">

              <p className="font-serif text-3xl">
                No thoughts yet.
              </p>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#928d82]">
                Reader thoughts will appear here when
                someone leaves one.
              </p>

            </div>

          ) : (

            <div className="border-t border-[#dedbd2]">

              {comments.map((comment, index) => (

                <article
                  key={comment.id}
                  className="border-b border-[#dedbd2] py-8"
                >

                  <div className="grid gap-6 md:grid-cols-[60px_1fr_auto]">

                    {/* NUMBER */}

                    <span className="text-[10px] text-[#aaa59a]">
                      {String(index + 1).padStart(2, "0")}
                    </span>


                    {/* COMMENT */}

                    <div className="min-w-0">

                      {/* STATUS + NAME */}

                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={`text-[9px] uppercase tracking-[0.25em] ${
                            comment.approved
                              ? "text-[#5f7257]"
                              : "text-[#a18455]"
                          }`}
                        >
                          {comment.approved
                            ? "Approved"
                            : "Pending"}
                        </span>

                        <span className="h-px w-4 bg-[#c7c3b9]" />

                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#aaa59a]">
                          {comment.name?.trim()
                            ? comment.name
                            : "Anonymous"}
                        </span>

                      </div>


                      {/* CONTENT */}

                      <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-[#55524b]">
                        {comment.content}
                      </p>


                      {/* META */}

                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#928d82]">

                        <span>
                          {formatDate(comment.createdAt)}
                        </span>

                        <span>
                          On: {comment.post.title}
                        </span>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex flex-col items-start gap-5 md:items-end">

                      {/* VIEW ARTICLE */}

                      <Link
                        href={`/post/${comment.post.slug}`}
                        target="_blank"
                        className="text-[10px] uppercase tracking-[0.2em] text-[#928d82] transition-colors hover:text-[#272622]"
                      >
                        View
                      </Link>


                      {/* MODERATION */}

                      <CommentActions
                        id={comment.id}
                        approved={comment.approved}
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
            Reader thoughts
          </span>

        </div>

      </footer>

    </main>
  );
}