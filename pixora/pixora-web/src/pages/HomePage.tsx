import React, { useState, useEffect, useMemo } from "react"
import { useAuthenticatedQuery } from "@/auth/keycloak"

import { CreatePostDialog } from "@/components/CreatePostDialog"

import { type Post, fetchPosts } from "@/api/posts"
import { useKeycloak } from "@react-keycloak/web"

export const HomePage: React.FC = () => {
  const { keycloak } = useKeycloak()

  const { data: posts, refetch } = useAuthenticatedQuery<Post[]>(
    "posts",
    (token) => fetchPosts(token),
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [columns, setColumns] = useState(3)

  const columnsArray = useMemo(() => {
    const columnsArray: Post[][] = Array.from({ length: columns }, () => [])

    posts
      ?.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .forEach((post, index) => {
        columnsArray[index % columns].push(post)
      })

    return columnsArray
  }, [columns, posts])

  useEffect(() => {
    keycloak.loadUserInfo()
  }, [keycloak])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) setColumns(1)
      else if (width < 1024) setColumns(2)
      else if (width < 1280) setColumns(3)
      else setColumns(4)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const createPost = () => {
    refetch()
  }

  return (
    <div className="ml-56 p-6">
      {/* Create Post Dialog */}
      <CreatePostDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={createPost}
      />

      <div className="flex flex-row items-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Discover Photos</h1>
          <p className="text-gray-500 mt-1">
            Beautiful moments from our community
          </p>
        </div>
        <div className="ml-auto flex flex-row px-4 items-center py-2 rounded-full space-x-2 text-blue-50 bg-blue-600 font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="w-5 h-5"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 8h.01" />
            <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
            <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
            <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
          </svg>
          <button onClick={() => setIsDialogOpen(true)}>
            Share your photos
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {columnsArray.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-5">
            {column.map((post) => (
              <div
                key={post.id}
                className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className="bg-gray-200 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    aspectRatio: `${post.images[0].width}/${post.images[0].height}`,
                    backgroundImage: `url(http://localhost:5008/v1/blobs/${post.images[0].id})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-5 w-5 text-gray-700"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                    </svg>
                  </button>
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-5 w-5 text-gray-700"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
