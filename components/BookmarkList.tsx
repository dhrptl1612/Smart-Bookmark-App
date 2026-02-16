"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import BookmarkItem from "./BookmarkItem"

export default function BookmarkList({ user }: any) {
  const supabase = createClient()
  const [bookmarks, setBookmarks] = useState<any[]>([])

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) console.error("Fetch error:", error)

    setBookmarks(data || [])
  }

  useEffect(() => {
    if (!user?.id) return

    fetchBookmarks()

    const channel = supabase
      .channel(`bookmarks-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Realtime event:", payload)
          fetchBookmarks()
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  )
}
