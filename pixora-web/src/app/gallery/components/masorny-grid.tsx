import Masonry from "react-responsive-masonry"
import type { Post } from "./feed"
import PostCard from "./post-card"

export type MasonryGridProps = {
  posts: Post[]
  columns: number
  onSelect: (post: Post) => void
}

export default function MasonryGrid({
  posts,
  columns,
  onSelect,
}: MasonryGridProps) {
  return (
    <Masonry columnsCount={columns} className="space-x-2">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onClick={() => onSelect(post)}
          onFavourite={() => console.log("added to favs")}
          onSave={() => console.log("saved to albums")}
        />
      ))}
    </Masonry>
  )
}
