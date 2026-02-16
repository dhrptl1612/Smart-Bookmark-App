"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function BookmarkForm({ user }: any) {
  const supabase = createClient()
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    setTitle("")
    setUrl("")
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={addBookmark}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Bookmark
      </button>
    </div>
  )
}
