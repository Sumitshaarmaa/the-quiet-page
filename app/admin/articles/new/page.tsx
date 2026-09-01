"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Genre = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export default function NewArticlePage() {
  const [genres, setGenres] = useState<Genre[]>([]);

  const [genreId, setGenreId] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("REFLECTION");
  const [featured, setFeatured] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [saving, setSaving] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadGenres() {
      try {
        setLoadingGenres(true);
        setError("");

        const response = await fetch("/api/admin/articles");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load genres."
          );
        }

        setGenres(data.genres || []);

        if (data.genres?.length > 0) {
          setGenreId(data.genres[0].id);
        }
      } catch (error) {
        console.error("Load genres error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load genres."
        );
      } finally {
        setLoadingGenres(false);
      }
    }

    loadGenres();
  }, []);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setError("");

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Unsupported image type. Please use JPG, PNG, WebP, or GIF."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be 10 MB or smaller.");

      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);
    setImageUrl("");
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
    setImageUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadImage() {
    if (!imageFile) {
      return "";
    }

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", imageFile);

      const response = await fetch(
        "/api/admin/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to upload image."
        );
      }

      const pathname = data.pathname;

      if (!pathname) {
        throw new Error(
          "Image uploaded but no image path was returned."
        );
      }

      setImageUrl(pathname);

      return pathname;
    } catch (error) {
      console.error("Upload image error:", error);

      throw new Error(
        error instanceof Error
          ? error.message
          : "Unable to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveArticle(published: boolean) {
    setError("");
    setSuccess("");

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
      let finalImageUrl = imageUrl;

      if (imageFile && !finalImageUrl) {
        finalImageUrl = await uploadImage();
      }

      const response = await fetch(
        "/api/admin/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            genreId,
            title: title.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            type,
            featured,
            published,

            imageUrl: finalImageUrl,
            imageAlt: imageAlt.trim(),
            imageCaption: imageCaption.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save article."
        );
      }

      setSuccess(
        published
          ? "Article published successfully."
          : "Draft saved successfully."
      );

      window.setTimeout(() => {
        window.location.href = "/admin/articles";
      }, 500);
    } catch (error) {
      console.error("Save article error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ed] text-[#272622]">

      {/* HEADER */}

      <header className="border-b border-[#d9d6cc]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

          <Link
            href="/admin"
            className="text-[12px] uppercase tracking-[0.28em]"
          >
            The Quiet Page
          </Link>

          <Link
            href="/admin/articles"
            className="text-sm text-[#77736b] transition-colors hover:text-[#272622]"
          >
            ← Articles
          </Link>

        </div>

      </header>


      {/* PAGE */}

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">

        <div className="mb-12">

          <p className="text-[9px] uppercase tracking-[0.3em] text-[#928d82]">
            New writing
          </p>

          <h1 className="mt-4 font-serif text-5xl tracking-[-0.04em] md:text-6xl">
            Write something quietly.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#77736b]">
            Create a reflection, story, idea, observation, or note.
          </p>

        </div>


        <div className="space-y-10">


          {/* TITLE */}

          <div>

            <label
              htmlFor="title"
              className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#928d82]"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Give your writing a title..."
              className="w-full border-b border-[#cfcac0] bg-transparent px-1 py-4 font-serif text-3xl outline-none placeholder:text-[#aaa59a] focus:border-[#272622] md:text-4xl"
            />

          </div>


          {/* GENRE + TYPE */}

          <div className="grid gap-8 md:grid-cols-2">

            {/* GENRE */}

            <div>

              <label
                htmlFor="genre"
                className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#928d82]"
              >
                Genre
              </label>

              <select
                id="genre"
                value={genreId}
                onChange={(event) =>
                  setGenreId(event.target.value)
                }
                disabled={loadingGenres}
                className="w-full border-b border-[#cfcac0] bg-transparent px-1 py-4 text-sm outline-none focus:border-[#272622]"
              >
                {loadingGenres ? (
                  <option value="">
                    Loading genres...
                  </option>
                ) : genres.length === 0 ? (
                  <option value="">
                    No genres available
                  </option>
                ) : (
                  genres.map((genre) => (
                    <option
                      key={genre.id}
                      value={genre.id}
                    >
                      {genre.name}
                    </option>
                  ))
                )}
              </select>

            </div>


            {/* TYPE */}

            <div>

              <label
                htmlFor="type"
                className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#928d82]"
              >
                Type
              </label>

              <select
                id="type"
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
                className="w-full border-b border-[#cfcac0] bg-transparent px-1 py-4 text-sm outline-none focus:border-[#272622]"
              >
                <option value="REFLECTION">
                  Reflection
                </option>

                <option value="STORY">
                  Story
                </option>

                <option value="IDEA">
                  Idea
                </option>

                <option value="OBSERVATION">
                  Observation
                </option>

                <option value="NOTE">
                  Note
                </option>

              </select>

            </div>

          </div>


          {/* EXCERPT */}

          <div>

            <label
              htmlFor="excerpt"
              className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#928d82]"
            >
              Short description
            </label>

            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(event) =>
                setExcerpt(event.target.value)
              }
              rows={3}
              maxLength={500}
              placeholder="A short introduction to this writing..."
              className="w-full resize-none border border-[#dedbd2] bg-[#eeece5] p-5 text-sm leading-7 outline-none placeholder:text-[#aaa59a] focus:border-[#aaa59a]"
            />

          </div>


          {/* CONTENT */}

          <div>

            <label
              htmlFor="content"
              className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#928d82]"
            >
              Writing
            </label>

            <textarea
              id="content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              rows={18}
              placeholder="Start writing..."
              className="w-full resize-y border border-[#dedbd2] bg-[#eeece5] p-6 font-serif text-lg leading-[1.8] outline-none placeholder:text-[#aaa59a] focus:border-[#aaa59a]"
            />

            <p className="mt-3 text-[10px] text-[#aaa59a]">
              Separate paragraphs with an empty line.
            </p>

          </div>


          {/* IMAGE */}

          <div className="border-t border-[#dedbd2] pt-10">

            <div className="mb-6">

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#928d82]">
                Image
              </p>

              <p className="mt-2 text-xs text-[#aaa59a]">
                Optional. JPG, PNG, WebP or GIF. Maximum 10 MB.
              </p>

            </div>


            {imagePreview ? (

              <div className="space-y-5">

                <div className="overflow-hidden border border-[#dedbd2] bg-[#eeece5]">

                  <img
                    src={imagePreview}
                    alt="Selected article image preview"
                    className="max-h-[500px] w-full object-contain"
                  />

                </div>


                <div className="flex flex-wrap items-center gap-4">

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="border border-[#aaa59a] px-5 py-3 text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-[#272622] hover:text-[#f7f5ed]"
                  >
                    Change image
                  </button>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-2 py-3 text-[10px] uppercase tracking-[0.22em] text-[#928d82] transition-colors hover:text-[#272622]"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ) : (

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex min-h-48 w-full items-center justify-center border border-dashed border-[#c9c5ba] bg-[#eeece5] px-6 py-10 text-center transition-colors hover:border-[#928d82] hover:bg-[#e9e7df]"
              >

                <span>

                  <span className="block font-serif text-2xl">
                    Choose an image
                  </span>

                  <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-[#928d82]">
                    Optional
                  </span>

                </span>

              </button>

            )}


            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
            />


            {imagePreview && (

              <div className="mt-8 space-y-6">

                {/* ALT */}

                <div>

                  <label
                    htmlFor="imageAlt"
                    className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#928d82]"
                  >
                    Image alt text
                  </label>

                  <input
                    id="imageAlt"
                    type="text"
                    value={imageAlt}
                    onChange={(event) =>
                      setImageAlt(event.target.value)
                    }
                    maxLength={300}
                    placeholder="Describe the image..."
                    className="w-full border-b border-[#cfcac0] bg-transparent px-1 py-4 text-sm outline-none placeholder:text-[#aaa59a] focus:border-[#272622]"
                  />

                  <p className="mt-2 text-[10px] text-[#aaa59a]">
                    A short description for accessibility.
                  </p>

                </div>


                {/* CAPTION */}

                <div>

                  <label
                    htmlFor="imageCaption"
                    className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#928d82]"
                  >
                    Image caption
                  </label>

                  <input
                    id="imageCaption"
                    type="text"
                    value={imageCaption}
                    onChange={(event) =>
                      setImageCaption(event.target.value)
                    }
                    maxLength={500}
                    placeholder="Optional caption..."
                    className="w-full border-b border-[#cfcac0] bg-transparent px-1 py-4 text-sm outline-none placeholder:text-[#aaa59a] focus:border-[#272622]"
                  />

                </div>

              </div>

            )}

          </div>


          {/* FEATURED */}

          <label className="flex cursor-pointer items-center gap-4 border-t border-[#dedbd2] pt-8">

            <input
              type="checkbox"
              checked={featured}
              onChange={(event) =>
                setFeatured(event.target.checked)
              }
              className="h-4 w-4 accent-[#272622]"
            />

            <span>

              <span className="block text-sm">
                Feature this writing
              </span>

              <span className="mt-1 block text-xs text-[#928d82]">
                Featured writings appear prominently on the homepage.
              </span>

            </span>

          </label>


          {/* ERROR */}

          {error && (
            <div className="border border-[#c9a9a1] bg-[#eee1dc] px-5 py-4 text-sm text-[#75483e]">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="border border-[#c9d2c5] bg-[#e8ece4] px-5 py-4 text-sm text-[#53624d]">
              {success}
            </div>
          )}


          {/* ACTIONS */}

          <div className="flex flex-col-reverse justify-between gap-5 border-t border-[#dedbd2] pt-8 sm:flex-row sm:items-center">

            <Link
              href="/admin/articles"
              className="text-[10px] uppercase tracking-[0.25em] text-[#928d82] transition-colors hover:text-[#272622]"
            >
              ← Cancel
            </Link>


            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                disabled={
                  saving ||
                  uploadingImage ||
                  loadingGenres
                }
                onClick={() =>
                  saveArticle(false)
                }
                className="border border-[#aaa59a] px-7 py-4 text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-[#e9e7df] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingImage
                  ? "Uploading image..."
                  : saving
                    ? "Saving..."
                    : "Save draft"}
              </button>


              <button
                type="button"
                disabled={
                  saving ||
                  uploadingImage ||
                  loadingGenres
                }
                onClick={() =>
                  saveArticle(true)
                }
                className="bg-[#272622] px-7 py-4 text-[10px] uppercase tracking-[0.25em] text-[#f7f5ed] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingImage
                  ? "Uploading image..."
                  : saving
                    ? "Publishing..."
                    : "Publish"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}