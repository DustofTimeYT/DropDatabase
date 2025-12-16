import { useEffect, useState } from "react"
import { fetchPosts, type Post } from "../gallery/components/feed"
import MasonryGrid from "../gallery/components/masorny-grid"
import PostCard from "../gallery/components/post-card"

const post: Post = {
  id: 1,
  description: "Post",
  images: [
    {
      id: 1,
      src: `https://picsum.photos/400/300`,
      width: 400,
      height: 300,
    },
    {
      id: 2,
      src: `https://picsum.photos/500/300`,
      width: 400,
      height: 300,
    },
    {
      id: 3,
      src: `https://picsum.photos/600/300`,
      width: 400,
      height: 300,
    },
  ],
}

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    setPosts(fetchPosts(1, 12))
  }, [])

  return (
    <div className="flex flex-row">
      <div className="flex flex-col space-y-3 w-3/6">
        <PostCard
          post={post}
          onClick={() => {}}
          onFavourite={() => console.log("added to favs")}
          onSave={() => console.log("saved to albums")}
        />
        <div className="w-full p-4 bg-[#dedef2] rounded-xl">
          <p>alexthvest</p>
        </div>
      </div>
      <div className="w-3/6 ml-4">
        <MasonryGrid posts={posts} columns={3} onSelect={() => {}} />
      </div>
    </div>
  )
}
