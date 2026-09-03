"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/app/components/Logo";

type Genre = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: {
    posts: number;
  };
};

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadGenres() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/genres");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load genres."
        );
      }

      setGenres(data.genres || []);
    } catch (error) {
      console.error("Load genres error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load genres."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGenres();
  }, []);

  // ─────────────────────────────────────────────
  // CREATE GENRE
  // ─────────────────────────────────────────────

  async function createGenre() {
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter a genre name.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create genre."
        );
      }

      const newGenre: Genre = {
        ...data.genre,
        _count: {
          posts: 0,
        },
      };

      setGenres((current) =>
        [...current, newGenre].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

      setName("");
      setDescription("");

      setSuccess("Genre created successfully.");
    } catch (error) {
      console.error("Create genre error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create genre."
      );
    } finally {
      setSaving(false);
    }
  }

  // ─────────────────────────────────────────────
  // START EDITING
  // ─────────────────────────────────────────────

  function startEditing(genre: Genre) {
    setError("");
    setSuccess("");

    setEditingId(genre.id);
    setEditingName(genre.name);
    setEditingDescription(genre.description || "");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingName("");
    setEditingDescription("");
  }

  // ─────────────────────────────────────────────
  // UPDATE GENRE
  // ─────────────────────────────────────────────

  async function updateGenre(id: string) {
    setError("");
    setSuccess("");

    if (!editingName.trim()) {
      setError("Please enter a genre name.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/genres/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingName.trim(),
            description: editingDescription.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update genre."
        );
      }

      setGenres((current) =>
        current
          .map((genre) =>
            genre.id === id
              ? {
                  ...data.genre,
                  _count: genre._count,
                }
              : genre
          )
          .sort((a, b) =>
            a.name.localeCompare(b.name)
          )
      );

      cancelEditing();

      setSuccess("Genre updated successfully.");
    } catch (error) {
      console.error("Update genre error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update genre."
      );
    } finally {
      setSaving(false);
    }
  }

  // ─────────────────────────────────────────────
  // DELETE GENRE
  // ─────────────────────────────────────────────

  async function deleteGenre(genre: Genre) {
    setError("");
    setSuccess("");

    const postCount = genre._count?.posts || 0;

    if (postCount > 0) {
      setError(
        `You cannot delete "${genre.name}" because ${postCount} article${
          postCount === 1 ? " uses" : "s use"
        } this genre.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete the genre "${genre.name}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(genre.id);

    try {
      const response = await fetch(
        `/api/admin/genres/${genre.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete genre."
        );
      }

      // Immediately remove it from the screen.
      setGenres((current) =>
        current.filter(
          (item) => item.id !== genre.id
        )
      );

      setSuccess("Genre deleted successfully.");
    } catch (error) {
      console.error("Delete genre error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete genre."
      );
    } finally {
      setDeletingId(null);
    }
  }

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
            The quiet categories
          </p>

          <h1 className="font-serif text-5xl tracking-[-0.04em] md:text-6xl">
            Give your writing a home.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#77736a]">
            Create and manage the places where your
            writings belong.
          </p>

        </div>


        {/* CREATE GENRE */}

        <section className="mt-12 border border-[#dedbd2] px-8 py-10 md:px-10 md:py-12">

          <p className="text-[10px] uppercase tracking-[0.35em] text-[#928d82]">
            New genre
          </p>

          <h2 className="mt-5 font-serif text-3xl md:text-4xl">
            Give your writing a home.
          </h2>


          <div className="mt-10 space-y-8">

            {/* NAME */}

            <div>

              <label className="text-[9px] uppercase tracking-[0.3em] text-[#928d82]">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Reflections"
                maxLength={100}
                disabled={saving}
                className="mt-3 w-full border-b border-[#bdb8ae] bg-transparent px-1 py-4 font-serif text-2xl outline-none placeholder:text-[#c4c0b8] focus:border-[#272622] disabled:opacity-50"
              />

            </div>


            {/* DESCRIPTION */}

            <div>

              <label className="text-[9px] uppercase tracking-[0.3em] text-[#928d82]">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="A short description..."
                rows={3}
                maxLength={300}
                disabled={saving}
                className="mt-3 w-full resize-none border-b border-[#bdb8ae] bg-transparent px-1 py-4 text-sm leading-7 outline-none placeholder:text-[#c4c0b8] focus:border-[#272622] disabled:opacity-50"
              />

            </div>


            {/* MESSAGES */}

            {error && (
              <div className="border border-[#c9a9a1] bg-[#eee1dc] px-4 py-3 text-sm text-[#75483e]">
                {error}
              </div>
            )}

            {success && (
              <div className="border border-[#c9d2c5] bg-[#e8ece4] px-4 py-3 text-sm text-[#53624d]">
                {success}
              </div>
            )}


            {/* BUTTON */}

            <div className="flex justify-end">

              <button
                type="button"
                onClick={createGenre}
                disabled={saving}
                className="border border-[#272622] bg-[#272622] px-7 py-4 text-[10px] uppercase tracking-[0.25em] text-[#f5f3ed] transition hover:bg-transparent hover:text-[#272622] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Creating..."
                  : "Create genre →"}
              </button>

            </div>

          </div>

        </section>


        {/* GENRE LIST */}

        <section className="mt-16">

          <div className="mb-8 flex items-end justify-between border-b border-[#dedbd2] pb-5">

            <div>

              <p className="text-[10px] uppercase tracking-[0.35em] text-[#928d82]">
                Your genres
              </p>

              <h2 className="mt-3 font-serif text-3xl">
                Writing homes.
              </h2>

            </div>

            <span className="text-xs text-[#aaa59a]">
              {genres.length}{" "}
              {genres.length === 1
                ? "genre"
                : "genres"}
            </span>

          </div>


          {/* ERROR FOR LIST ACTIONS */}

          {error && (
            <div className="mb-6 border border-[#c9a9a1] bg-[#eee1dc] px-4 py-3 text-sm text-[#75483e]">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 border border-[#c9d2c5] bg-[#e8ece4] px-4 py-3 text-sm text-[#53624d]">
              {success}
            </div>
          )}


          {/* LOADING */}

          {loading && (
            <div className="border-t border-[#dedbd2] py-12">

              <p className="text-sm text-[#928d82]">
                Opening your genres...
              </p>

            </div>
          )}


          {/* EMPTY */}

          {!loading && genres.length === 0 && (
            <div className="border border-[#dedbd2] px-8 py-20 text-center">

              <p className="font-serif text-3xl">
                No genres yet.
              </p>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#928d82]">
                Create your first genre above and give
                your writing somewhere to belong.
              </p>

            </div>
          )}


          {/* GENRES */}

          {!loading && genres.length > 0 && (
            <div className="border-t border-[#dedbd2]">

              {genres.map((genre, index) => {

                const isEditing =
                  editingId === genre.id;

                const postCount =
                  genre._count?.posts || 0;

                return (
                  <article
                    key={genre.id}
                    className="border-b border-[#dedbd2] py-8"
                  >

                    {!isEditing ? (

                      <div className="grid gap-6 md:grid-cols-[60px_1fr_auto] md:items-center">

                        {/* NUMBER */}

                        <span className="text-[10px] text-[#aaa59a]">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>


                        {/* INFO */}

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <span className="text-[9px] uppercase tracking-[0.25em] text-[#77736a]">
                              Genre
                            </span>

                            <span className="h-px w-4 bg-[#c7c3b9]" />

                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#aaa59a]">
                              {postCount}{" "}
                              {postCount === 1
                                ? "article"
                                : "articles"}
                            </span>

                          </div>


                          <h3 className="mt-3 font-serif text-3xl">
                            {genre.name}
                          </h3>


                          {genre.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77736a]">
                              {genre.description}
                            </p>
                          )}


                          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#aaa59a]">
                            /genre/{genre.slug}
                          </p>

                        </div>


                        {/* ACTIONS */}

                        <div className="flex items-center gap-5 md:justify-end">

                          <Link
                            href={`/genre/${encodeURIComponent(
                              genre.slug
                            )}`}
                            target="_blank"
                            className="text-[10px] uppercase tracking-[0.2em] text-[#928d82] transition-colors hover:text-[#272622]"
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              startEditing(genre)
                            }
                            className="border-b border-[#aaa59a] pb-1 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-[#272622]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteGenre(genre)
                            }
                            disabled={
                              deletingId === genre.id ||
                              postCount > 0
                            }
                            title={
                              postCount > 0
                                ? "This genre is being used by articles."
                                : "Delete genre"
                            }
                            className="border-b border-[#c9a9a1] pb-1 text-[10px] uppercase tracking-[0.2em] text-[#9a5d50] transition-colors hover:border-[#75483e] disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            {deletingId === genre.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </div>

                    ) : (

                      /* EDIT FORM */

                      <div className="md:pl-[60px]">

                        <div className="mb-6">

                          <p className="text-[9px] uppercase tracking-[0.3em] text-[#928d82]">
                            Editing genre
                          </p>

                          <input
                            type="text"
                            value={editingName}
                            onChange={(event) =>
                              setEditingName(
                                event.target.value
                              )
                            }
                            maxLength={100}
                            disabled={saving}
                            className="mt-3 w-full border-b border-[#bdb8ae] bg-transparent px-1 py-4 font-serif text-3xl outline-none focus:border-[#272622]"
                          />

                        </div>


                        <div>

                          <label className="text-[9px] uppercase tracking-[0.3em] text-[#928d82]">
                            Description
                          </label>

                          <textarea
                            value={editingDescription}
                            onChange={(event) =>
                              setEditingDescription(
                                event.target.value
                              )
                            }
                            rows={3}
                            maxLength={300}
                            disabled={saving}
                            className="mt-3 w-full resize-none border-b border-[#bdb8ae] bg-transparent px-1 py-4 text-sm leading-7 outline-none focus:border-[#272622]"
                          />

                        </div>


                        <div className="mt-7 flex items-center justify-end gap-5">

                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={saving}
                            className="text-[10px] uppercase tracking-[0.2em] text-[#928d82] hover:text-[#272622] disabled:opacity-50"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateGenre(genre.id)
                            }
                            disabled={saving}
                            className="border border-[#272622] bg-[#272622] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-[#f5f3ed] transition hover:bg-transparent hover:text-[#272622] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {saving
                              ? "Saving..."
                              : "Save changes →"}
                          </button>

                        </div>

                      </div>

                    )}

                  </article>
                );
              })}

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
            Categories & genres
          </span>

        </div>

      </footer>

    </main>
  );
}