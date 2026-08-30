"use client";

import { FormEvent, useEffect, useState } from "react";

type Comment = {
  id: string;
  name: string | null;
  content: string;
  createdAt: string;
};

type CommentsProps = {
  slug: string;
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function Comments({
  slug,
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/posts/${encodeURIComponent(slug)}/comments`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load thoughts."
          );
        }

        setComments(data.comments || []);
      } catch (error) {
        console.error("Load comments error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load thoughts."
        );
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [slug]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!content.trim()) {
      setError(
        "Please write a thought before sharing."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(slug)}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            content: content.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to share your thought."
        );
      }

      setComments((current) => [
        data.comment,
        ...current,
      ]);

      setName("");
      setContent("");

      setSuccess("Your thought has been shared.");
    } catch (error) {
      console.error("Submit comment error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to share your thought."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">

      {/* FORM */}

      <div className="border-t border-[#dedbd2] pt-12">

        <p className="text-[10px] uppercase tracking-[0.35em] text-[#928d82]">
          After reading
        </p>

        <h2 className="mt-5 font-serif text-4xl md:text-5xl">
          Leave a thought.
        </h2>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#77736a]">
          What did this page make you think about?
          You can leave your name, or simply remain
          anonymous.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-5"
        >

          {/* NAME */}

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Your name (optional)"
            maxLength={100}
            className="w-full border-b border-[#cfcac0] bg-transparent px-1 py-4 text-sm outline-none placeholder:text-[#aaa59a] focus:border-[#272622]"
          />

          {/* CONTENT */}

          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            rows={6}
            maxLength={2000}
            placeholder="Write your thought..."
            className="w-full resize-none border border-[#dedbd2] bg-[#eeece5] p-5 text-sm leading-7 outline-none placeholder:text-[#aaa59a] focus:border-[#aaa59a]"
          />

          {/* ERROR */}

          {error && (
            <div className="border border-[#c9a9a1] bg-[#eee1dc] px-4 py-3 text-sm text-[#75483e]">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="border border-[#c9d2c5] bg-[#e8ece4] px-4 py-3 text-sm text-[#53624d]">
              {success}
            </div>
          )}

          {/* BUTTON */}

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={submitting}
              className="border-b border-[#272622] pb-2 text-[10px] uppercase tracking-[0.25em] transition-all hover:pr-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Sharing..."
                : "Share your thought →"}
            </button>

          </div>

        </form>

      </div>


      {/* THOUGHTS */}

      <div className="mt-20 border-t border-[#dedbd2] pt-12">

        <div className="flex items-center justify-between">

          <h3 className="font-serif text-2xl">
            Thoughts
          </h3>

          <span className="text-xs text-[#aaa59a]">
            {comments.length}{" "}
            {comments.length === 1
              ? "thought"
              : "thoughts"}
          </span>

        </div>


        {/* LOADING */}

        {loading && (
          <p className="mt-8 text-sm text-[#928d82]">
            Reading thoughts...
          </p>
        )}


        {/* EMPTY */}

        {!loading && comments.length === 0 && (
          <p className="mt-8 text-sm leading-7 text-[#928d82]">
            No thoughts yet. Perhaps you'll be the
            first.
          </p>
        )}


        {/* COMMENTS */}

        {!loading && comments.length > 0 && (
          <div className="mt-8 space-y-0">

            {comments.map((comment) => (

              <div
                key={comment.id}
                className="border-b border-[#dedbd2] py-7"
              >

                <div className="flex items-center justify-between gap-4">

                  <span className="text-xs font-medium">
                    {comment.name?.trim()
                      ? comment.name
                      : "Anonymous"}
                  </span>

                  <span className="text-[10px] text-[#aaa59a]">
                    {formatDate(comment.createdAt)}
                  </span>

                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#77736a]">
                  {comment.content}
                </p>

              </div>

            ))}

          </div>
        )}

      </div>

    </section>
  );
}