"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteArticleButtonProps = {
  id: string;
  title: string;
};

export default function DeleteArticleButton({
  id,
  title,
}: DeleteArticleButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/articles/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete article."
        );
      }

      router.refresh();
    } catch (error) {
      console.error("Delete article error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete article."
      );

      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="border-b border-[#d0aaa3] pb-1 text-[10px] uppercase tracking-[0.2em] text-[#9a5b50] transition-colors hover:border-[#75483e] hover:text-[#75483e] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}