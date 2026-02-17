"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabaseClient"

export default function BookmarkForm() {
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUserId(data.user?.id ?? null)
      console.log("Loaded user:", data.user?.id)
    }

    loadUser()
  }, [])

  const addBookmark = async () => {
    if (!userId) {
      alert("Not logged in")
      return
    }

const { data, error } = await supabase
  .from("bookmarks")
  .insert([
    {
      title,
      url,
      user_id: userId,
    },
  ])
  .select()
console.log("Inserted row:", data)

    if (error) {
      console.log("Insert error:", error)
    } else {
      setTitle("")
      setUrl("")
    }
  }

  return (
    <div className="card p-6 rounded-2xl shadow-md space-y-4 mb-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full border p-3 rounded-lg bg-transparent"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL"
        className="w-full border p-3 rounded-lg bg-transparent"
      />
      <button
        onClick={addBookmark}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg"
      >
        Add Bookmark
      </button>
    </div>
  )
}
