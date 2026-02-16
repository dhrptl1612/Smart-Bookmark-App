"use client"

import { createClient } from "@/lib/supabase-browser"
import { Bookmark } from "@/types"

export default function BookmarkItem({
  bookmark,
}: {
  bookmark: Bookmark
}) {
  const supabase = createClient()

  const deleteBookmark = async () => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmark.id)
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-2 flex justify-between">
      <a href={bookmark.url} target="_blank">
        {bookmark.title}
      </a>
      <button
        onClick={deleteBookmark}
        className="text-red-500"
      >
        Delete
      </button>
    </div>
  )
}
