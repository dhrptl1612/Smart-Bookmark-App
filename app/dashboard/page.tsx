"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Bookmark } from "@/types"
import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"

export default function Dashboard() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      fetchBookmarks()
    }

    init()
  }, [])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setBookmarks(data)
  }

  // REALTIME
  useEffect(() => {
    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto p-6">
      <BookmarkForm user={user} />
      <BookmarkList bookmarks={bookmarks} />
    </div>
  )
}
