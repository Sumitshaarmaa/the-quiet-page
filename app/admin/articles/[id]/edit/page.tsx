"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Genre = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type Article = {
  id: string;
  title: string;
  slug: string;
  type: string;
  excerpt: string | null;
  content: string;
  featured: boolean;
  published: boolean;
  genreId: string;
  genre: Genre;
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [genreId, setGenreId] = useState("");
  const [type, setType] = useState("REFLECTION");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/articles/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load article."
          );
        }

        const loadedArticle = data.post as Article;

        setArticle(loadedArticle);

        setTitle(loadedArticle.title);
        setExcerpt(loadedArticle.excerpt || "");
        setContent(loadedArticle.content);
        setGenreId(loadedArticle.genreId);
        setType(loadedArticle.type);
        setFeatured(loadedArticle.featured);
        setPublished(loadedArticle.published);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load article."
        );
      } finally {
        setLoading(false);
      }
    }

    async function loadGenres() {
      try {
        const response = await fetch(
          "/api/admin/articles"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load genres."
          );
        }

        setGenres(data.genres || []);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load genres."
        );
      }
    }

    if (id) {
      loadArticle();
      loadGenres();
    }
  }, [id]);

  async function saveArticle(nextPublished: boolean) {
    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Please give your article a title.");
      return;
    }

    if (!content.trim()) {
      setError("Please write something before saving.");
      return;
    }

    if (!genreId) {
      setError("Please choose a genre.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/articles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            type,
            genreId,
            featured,
            published: nextPublished,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update article."
        );
      }

      setPublished(nextPublished);

      setMessage(
        nextPublished
          ? "Article published successfully."
          : "Draft saved successfully."
      );

      setTimeout(() => {
        router.push("/admin/articles");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update article."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f3ed] text-[#272622]">
        <div className="mx-auto max-w-5xl px-6 py-32 lg:px-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#928d82]">
            Loading
          </p>

          <h1 className="mt-5 font-serif text-5xl">
            Opening your writing...
          </h1>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#f5f3ed] text-[#272622]">
        <div className="mx-auto max-w-5xl px-6 py-32 lg:px-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#928d82]">
            Something went wrong
          </p>

          <h1 className="mt-5 font-serif text-5xl">
            Article not found.
          </h1>

          {error && (
            <p className="mt-5 text-sm text-[#75483e]">
              {error}
            </p>
          )}

          <Link
            href="/admin/articles"
            className="mt-8 inline-block border-b border-[#272622] pb-2 text-[10px] uppercase tracking-[0.25em]"
          >
            ← Back to articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ed] text-[#272622]">

      {/* HEADER */}

      <header className="border-b border-[#d9d6cc]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

          <Link
            href="/admin/articles"
            className="text-[12px] uppercase tracking-[0.28em]"
          >
            The Quiet Page
          </Link>

          <Link
            href="/admin/articles"
            className="text-sm text-[#77736b] hover:text-[#272622]"
          >
            ← Back to articles
          </Link>

        </div>

      </header>


      {/* MAIN */}

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">

        <div className="mb-16">

          <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#99948a]">
            Edit writing
          </p>

          <h1 className="font-serif text-5xl leading-none tracking-[-0.04em] md:text-7xl">
            Refine the page.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#77736b]">
            Make changes to your writing, move it to another
            section, or change whether it is visible to readers.
          </p>

        </div>


        <div className="space-y-12">

          {/* GENRE */}

          <div className="border-t border-[#d9d6cc] pt-6">

            <label
              htmlFor="genre"
              className="mb-4 block text-[10px] uppercase tracking-[0.3em] text-[#99948a]"
            >
              Genre
            </label>

            <select
              id="genre"
              value={genreId}
              onChange={(event) =>
                setGenreId(event.target.value)
              }
              className="w-full border-b border-[#aaa69c] bg-transparent px-0 py-4 font-serif text-2xl outline-none"
            >
              {genres.map((genre) => (
                <option
                  key={genre.id}
                  value={genre.id}
                >
                  {genre.name}
                </option>
              ))}
            </select>

          </div>


          {/* TYPE */}

          <div className="border-t border-[#d9d6cc] pt-6">

            <label
              htmlFor="type"
              className="mb-4 block text-[10px] uppercase tracking-[0.3em] text-[#99948a]"
            >
              Form
            </label>

            <select
              id="type"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
              className="w-full border-b border-[#aaa69c] bg-transparent px-0 py-4 text-sm outline-none"
            >
              <option value="REFLECTION">
                Reflection
              </option>

              <option value="STORY">
                Story
              </option>

              <option value="LONGFORM">
                Longform
              </option>

              <option value="FRAGMENT">
                Fragment
              </option>

              <option value="NOTE">
                Note
              </option>
            </select>

          </div>


          {/* TITLE */}

          <div className="border-t border-[#d9d6cc] pt-6">

            <label
              htmlFor="title"
              className="mb-4 block text-[10px] uppercase tracking-[0.3em] text-[#99948a]"
            >
              Title
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              className="w-full border-b border-[#aaa69c] bg-transparent px-0 py-4 font-serif text-4xl outline-none md:text-5xl"
            />

          </div>


          {/* EXCERPT */}

          <div className="border-t border-[#d9d6cc] pt-6">

            <label
              htmlFor="excerpt"
              className="mb-4 block text-[10px] uppercase tracking-[0.3em] text-[#99948a]"
            >
              Short introduction
            </label>

            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(event) =>
                setExcerpt(event.target.value)
              }
              rows={3}
              className="w-full resize-none border-b border-[#aaa69c] bg-transparent px-0 py-4 text-lg leading-8 outline-none"
            />

          </div>


          {/* CONTENT */}

          <div className="border-t border-[#d9d6cc] pt-6">

            <label
              htmlFor="content"
              className="mb-4 block text-[10px] uppercase tracking-[0.3em] text-[#99948a]"
            >
              Writing
            </label>

            <textarea
              id="content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              rows={20}
              className="w-full resize-y border border-[#d9d6cc] bg-[#f3f1e9] p-6 font-serif text-xl leading-9 outline-none md:p-8 md:text-2xl"
            />

          </div>


          {/* FEATURED */}

          <div className="border-t border-[#d9d6cc] pt-8">

            <label className="flex cursor-pointer items-center gap-3">

              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(event.target.checked)
                }
              />

              <span className="text-sm uppercase tracking-[0.15em]">
                Featured article
              </span>

            </label>

          </div>


          {/* STATUS */}

          <div className="border-t border-[#d9d6cc] pt-8">

            <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-[#99948a]">
              Status
            </p>

            <div className="flex gap-8">

              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="radio"
                  name="status"
                  checked={!published}
                  onChange={() =>
                    setPublished(false)
                  }
                />

                <span className="text-sm uppercase tracking-[0.15em]">
                  Draft
                </span>

              </label>


              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="radio"
                  name="status"
                  checked={published}
                  onChange={() =>
                    setPublished(true)
                  }
                />

                <span className="text-sm uppercase tracking-[0.15em]">
                  Published
                </span>

              </label>

            </div>

          </div>


          {/* MESSAGES */}

          {error && (
            <div className="border border-[#c9a9a1] bg-[#eee1dc] px-4 py-3 text-sm text-[#75483e]">
              {error}
            </div>
          )}

          {message && (
            <div className="border border-[#b8c5b0] bg-[#e8ede4] px-4 py-3 text-sm text-[#4e6048]">
              {message}
            </div>
          )}


          {/* ACTIONS */}

          <div className="flex flex-col justify-between gap-5 border-t border-[#d9d6cc] pt-8 sm:flex-row sm:items-center">

            <p className="text-sm text-[#8b877e]">
              Editing · {article.title}
            </p>

            <div className="flex gap-3">

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveArticle(false)
                }
                className="border border-[#aaa69c] px-7 py-4 text-[11px] uppercase tracking-[0.2em] transition hover:bg-[#e9e6dc] disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save draft"}
              </button>


              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveArticle(true)
                }
                className="bg-[#272622] px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-[#f7f5ed] transition hover:bg-[#3b3934] disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Publish →"}
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}