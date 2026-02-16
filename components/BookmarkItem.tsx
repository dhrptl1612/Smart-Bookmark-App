"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function BookmarkItem({ bookmark }: any) {
  const supabase = createClient()
  const [edit, setEdit] = useState(false)
  const [newUrl, setNewUrl] = useState(bookmark.url)

  const deleteBookmark = async () => {
    await supabase.from("bookmarks").delete().eq("id", bookmark.id)
  }

  const updateUrl = async () => {
  console.log("Updating:", bookmark.id)

  const { error } = await supabase
    .from("bookmarks")
    .update({ url: newUrl })
    .eq("id", bookmark.id)

  if (error) {
    console.error("Update error:", error)
  } else {
    console.log("Updated successfully")
    setEdit(false)
  }
}


  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
      <div>
        <p className="font-semibold">{bookmark.title}</p>

        {edit ? (
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="border p-1 mt-1 rounded"
          />
        ) : (
          <a href={bookmark.url} target="_blank" className="text-indigo-600">
            {bookmark.url}
          </a>
        )}
      </div>

      <div className="space-x-3">
        {edit ? (
          <button
            onClick={updateUrl}
            className="text-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="text-blue-600"
          >
            Edit
          </button>
        )}

        <button
          onClick={deleteBookmark}
          className="text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
