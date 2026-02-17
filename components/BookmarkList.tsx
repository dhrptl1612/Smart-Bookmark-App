"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabaseClient"

export default function BookmarkList() {
  const supabase = createClient()
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [userId, setUserId] = useState<any>()

useEffect(() => {
  const loadUserAndBookmarks = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    setUserId(user.id)

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setBookmarks(data ?? [])

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("EVENT RECEIVED:", payload)

          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new, ...prev])
          }

          if (payload.eventType === "DELETE") {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            )
          }

          if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? payload.new : b
              )
            )
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status)
      })

    return channel
  }

  let channel: any

  loadUserAndBookmarks().then((c) => {
    channel = c
  })

  return () => {
    if (channel) supabase.removeChannel(channel)
  }
}, [])

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
  }

  return (
    <div className="space-y-4">
      {bookmarks.length === 0 && (
        <p className="text-center opacity-60">
          No bookmarks yet.
        </p>
      )}

      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="card p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md transition"
        >
          <div className="flex-1">
            <p className="font-semibold text-lg">
              {bookmark.title}
            </p>

            <a
              href={bookmark.url}
              target="_blank"
              className="text-indigo-500 break-all hover:underline"
            >
              {bookmark.url}
            </a>
          </div>

          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}