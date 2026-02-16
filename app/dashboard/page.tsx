import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <form action="/auth/logout" method="post">
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </form>
      </div>

      <BookmarkForm user={user} />
      <BookmarkList user={user} />
    </div>
  )
}
