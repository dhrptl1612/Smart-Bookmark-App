import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        My Dashboard
      </h1>

      <BookmarkForm />
      <BookmarkList />
    </div>
  )
}
