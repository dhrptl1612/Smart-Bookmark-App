import { Bookmark } from "@/types"
import BookmarkItem from "@/components/BookmarkItem"

export default function BookmarkList({
  bookmarks,
}: {
  bookmarks: Bookmark[]
}) {
  return (
    <div>
      {bookmarks.map((b) => (
        <BookmarkItem key={b.id} bookmark={b} />
      ))}
    </div>
  )
}
