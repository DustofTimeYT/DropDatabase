import { ArrowLeft, ArrowRight, Bookmark, Heart } from "@solar-icons/react"
import { useEffect, useRef, useState } from "react"
import { NavLink } from "react-router"
import type { Image, Post } from "./feed"

export type PostCardProps = {
  post: Post
  onClick: () => void
  onSave: (image: Image) => void
  onFavourite: (image: Image) => void
}

export default function PostCard({
  post,
  onClick,
  onSave,
  onFavourite,
}: PostCardProps) {
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth)
    }
  }, [])

  const prev = () => {
    setIndex((i) => (i === 0 ? post.images.length - 1 : i - 1))
  }

  const next = () => {
    setIndex((i) => (i === post.images.length - 1 ? 0 : i + 1))
  }

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-xl bg-black/5 mb-2"
      onClick={onClick}
    >
      <NavLink
        to={`/posts/${post.id}`}
        className="w-full h-full flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${index * width}px)`,
        }}
      >
        {post.images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            className="w-full h-full object-cover shrink-0"
            alt=""
          />
        ))}
      </NavLink>

      <div className="absolute top-6 -translate-y-1/2 right-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onFavourite(post.images[index])
          }}
          className="mr-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100"
        >
          {post.images[index].saved ? (
            <Heart weight="Bold" size={20} />
          ) : (
            <Heart size={20} />
          )}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSave(post.images[index])
          }}
          className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100"
        >
          {post.images[index].saved ? (
            <Bookmark weight="Bold" size={20} />
          ) : (
            <Bookmark size={20} />
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          prev()
        }}
        className="absolute cursor-pointer top-1/2 -translate-y-1/2 left-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100"
      >
        <ArrowLeft size={20} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          next()
        }}
        className="absolute cursor-pointer top-1/2 -translate-y-1/2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100"
      >
        <ArrowRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2 opacity-0 group-hover:opacity-100">
        {post.images.map((image, i) => (
          <div
            key={image.id}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
