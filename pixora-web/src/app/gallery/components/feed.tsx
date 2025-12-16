import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import MasonryGrid from "./masorny-grid"

export type Post = {
  id: number
  description: string
  images: Image[]
}

export type Image = {
  id: number
  src: string
  width: number
  height: number
  saved?: boolean
  favourite?: boolean
}

export function fetchImages(postId: number, count: number): Image[] {
  const images: Image[] = Array.from({ length: count }).map((_, i) => {
    const id = postId * 100 + i
    const height = 300 + Math.floor(Math.random() * 200)
    return {
      id,
      src: `https://picsum.photos/400/${height}`,
      width: 400,
      height,
    }
  })
  return images
}

export function fetchPosts(page: number, count: number): Post[] {
  const posts: Post[] = Array.from({ length: count }).map((_, i) => {
    const id = page * count + i
    const images = fetchImages(id, 5)

    return {
      id: id,
      description: "Some text",
      images: images,
    }
  })
  return posts
}

export default function Feed() {
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, selectPost] = useState<Post | null>(null)

  const loadPosts = async () => {
    const response = fetchPosts(page, 100)

    setPosts((prevPosts) => [...prevPosts, ...response])
    setPage((prevPage) => prevPage + 1)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: I need this
  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <>
      <div>{selectedPost?.id}</div>
      <InfiniteScroll
        dataLength={page * 100}
        hasMore={true}
        next={loadPosts}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You reached the end.</b>
          </p>
        }
      >
        <MasonryGrid posts={posts} columns={5} onSelect={selectPost} />
      </InfiniteScroll>
    </>
  )
}
