"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  approved: boolean;
};

export default function CommentActions({
  id,
  approved,
}: Props) {
  const router = useRouter();

  const [isApproved, setIsApproved] = useState(approved);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function updateApproval(nextApproved: boolean) {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/comments/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approved: nextApproved,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update thought."
        );
      }

      // Update the button immediately.
      setIsApproved(nextApproved);

      // Stop showing "Working..."
      setLoading(false);

      // Refresh server data so the statistics update too.
      router.refresh();
    } catch (error) {
      console.error("Update comment error:", error);

      setLoading(false);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update thought."
      );
    }
  }

  async function deleteComment() {
    if (loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this thought?\n\nThis cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/comments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete thought."
        );
      }

      // Hide the comment immediately.
      setDeleted(true);

      setLoading(false);

      // Refresh server data so the count updates.
      router.refresh();
    } catch (error) {
      console.error("Delete comment error:", error);

      setLoading(false);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete thought."
      );
    }
  }

  // Don't show anything after deletion.
  if (deleted) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4">

      {/* APPROVE / HIDE */}

      {isApproved ? (
        <button
          type="button"
          onClick={() => updateApproval(false)}
          disabled={loading}
          className="border-b border-[#aaa59a] pb-1 text-[10px] uppercase tracking-[0.2em] text-[#77736a] transition-colors hover:border-[#272622] hover:text-[#272622] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Working..." : "Hide"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => updateApproval(true)}
          disabled={loading}
          className="border-b border-[#8b9b82] pb-1 text-[10px] uppercase tracking-[0.2em] text-[#5f7257] transition-colors hover:border-[#4e6148] hover:text-[#4e6148] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Working..." : "Approve"}
        </button>
      )}

      {/* DELETE */}

      <button
        type="button"
        onClick={deleteComment}
        disabled={loading}
        className="border-b border-[#d0aaa3] pb-1 text-[10px] uppercase tracking-[0.2em] text-[#9a5b50] transition-colors hover:border-[#75483e] hover:text-[#75483e] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Working..." : "Delete"}
      </button>

    </div>
  );
}