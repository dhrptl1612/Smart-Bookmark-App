"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function BookmarkForm({ user }: any) {
  const supabase = createClient()
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const addBookmark = async () => {
    if (!title || !url) return

    // Check duplicate title
    const { data } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("title", title)
      .eq("user_id", user.id)

    if (data && data.length > 0) {
      setError("Title already exists!")
      return
    }

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    setTitle("")
    setUrl("")
    setError("")
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <input
        className="border p-3 w-full mb-3 rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-3 w-full mb-3 rounded"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={addBookmark}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
      >
        Add Bookmark
      </button>
    </div>
  )
}
