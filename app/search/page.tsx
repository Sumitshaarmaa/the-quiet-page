"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type SearchPost = {
  id: string;
  title: string;
  slug: string;
  type: string;
  excerpt: string | null;
  publishedAt: string | null;
  createdAt: string;
  genre: {
    name: string;
    slug: string;
  };
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPost[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    setError("");
    setSearched(true);

    if (!trimmedQuery) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(trimmedQuery)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to search writings."
        );
      }

      setResults(data.posts || []);
    } catch (error) {
      console.error("Search error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to search writings."
      );

      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#272622]">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#dedbd2] bg-[#f5f3ed]/95 backdrop-blur">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#272622] text-xs transition-transform duration-300 group-hover:rotate-45">
              T
            </span>

            <span className="text-[11px] font-medium tracking-[0.28em]">
              THE QUIET PAGE
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
            >
              Home
            </Link>

            <Link
              href="/"
              className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
            >
              ← Back
            </Link>
          </nav>

        </div>

      </header>


      {/* SEARCH */}

      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28 lg:px-10">

        <div className="border-b border-[#dedbd2] pb-12">

          <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#928d82]">
            Search the notebook
          </p>

          <h1 className="font-serif text-5xl tracking-[-0.04em] md:text-7xl">
            Find a thought.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-[#77736a]">
            Search through the writings, ideas, reflections,
            stories, and thoughts on The Quiet Page.
          </p>

        </div>


        {/* SEARCH FORM */}

        <form
          onSubmit={handleSearch}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >

          <div className="flex-1 border-b border-[#aaa59a]">
            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search writings..."
              autoFocus
              className="w-full bg-transparent px-1 py-5 text-lg outline-none placeholder:text-[#aaa59a]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="border border-[#272622] bg-[#272622] px-8 py-4 text-[10px] uppercase tracking-[0.25em] text-[#f5f3ed] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search →"}
          </button>

        </form>


        {/* ERROR */}

        {error && (
          <div className="mt-8 border border-[#c9a9a1] bg-[#eee1dc] px-5 py-4 text-sm text-[#75483e]">
            {error}
          </div>
        )}


        {/* RESULTS */}

        {searched && !loading && !error && (
          <section className="mt-16">

            <div className="flex items-center justify-between border-b border-[#dedbd2] pb-5">

              <p className="text-[10px] uppercase tracking-[0.3em] text-[#928d82]">
                Search results
              </p>

              <span className="text-xs text-[#aaa59a]">
                {results.length}{" "}
                {results.length === 1
                  ? "writing"
                  : "writings"}
              </span>

            </div>


            {results.length === 0 ? (

              <div className="py-20 text-center">

                <p className="font-serif text-3xl">
                  Nothing found.
                </p>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#928d82]">
                  Try another word or phrase.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-[#dedbd2]">

                {results.map((post, index) => (

                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className="group block py-8 transition-all hover:px-3"
                  >

                    <div className="flex items-start justify-between gap-6">

                      <div className="flex gap-6">

                        <span className="pt-1 text-[10px] text-[#aaa59a]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <span className="text-[9px] uppercase tracking-[0.25em] text-[#928d82]">
                              {post.type}
                            </span>

                            <span className="h-px w-4 bg-[#c7c3b9]" />

                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#aaa59a]">
                              {post.genre.name}
                            </span>

                          </div>

                          <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] md:text-4xl">
                            {post.title}
                          </h2>

                          {post.excerpt && (
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77736a]">
                              {post.excerpt}
                            </p>
                          )}

                          <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#aaa59a]">
                            {formatDate(
                              post.publishedAt ||
                                post.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                      <span className="hidden pt-1 text-lg text-[#aaa59a] transition-transform duration-300 group-hover:translate-x-2 sm:block">
                        →
                      </span>

                    </div>

                  </Link>

                ))}

              </div>

            )}

          </section>
        )}

      </section>


      {/* FOOTER */}

      <footer className="border-t border-[#dedbd2]">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-10 text-[9px] uppercase tracking-[0.2em] text-[#aaa59a] md:flex-row lg:px-10">

          <span>
            © 2026 The Quiet Page
          </span>

          <Link
            href="/"
            className="transition-colors hover:text-[#272622]"
          >
            Written quietly. Read slowly.
          </Link>

        </div>

      </footer>

    </main>
  );
}