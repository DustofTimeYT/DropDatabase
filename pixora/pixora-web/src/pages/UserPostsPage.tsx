import React, { useState, useEffect, useMemo } from "react"
import { useAuthenticatedQuery } from "@/auth/keycloak"

import { CreatePostDialog } from "@/components/CreatePostDialog"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"

import { type Post, fetchUserPosts } from "@/api/posts"
import { useKeycloak } from "@react-keycloak/web"

export const UserPostsPage: React.FC = () => {
  const { keycloak } = useKeycloak()

  const { data: posts, refetch } = useAuthenticatedQuery<Post[]>(
    "posts",
    (token) => fetchUserPosts(token),
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

  const deletePost = async (id: string) => {
    const response = await fetch(`http://localhost:5004/v1/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    })

    if (response.status != 204) {
      console.log("error")
      return
    }

    await refetch()
  }

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    postId: null as string | null,
  })

  const handleDeletePost = (postId: string) => {
    deletePost(postId).then(() =>
      setDeleteDialog({ isOpen: false, postId: null }),
    )
  }

  const openDeleteDialog = (postId: string) => {
    setDeleteDialog({ isOpen: true, postId })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, postId: null })
  }

  return (
    <div className="ml-56 p-6">
      {/* Create Post Dialog */}
      <CreatePostDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={createPost}
      />

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={() => handleDeletePost(deleteDialog.postId!)}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />

      <div className="flex flex-row items-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Photos</h1>
          <p className="text-gray-500 mt-1">Beautiful moments from you</p>
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
                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                      <path d="M13.5 6.5l4 4" />
                    </svg>
                  </button>
                  <button
                    className="bg-red-500 p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                    onClick={() => openDeleteDialog(post.id)}
                  >
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
                      className="h-5 w-5 text-white"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 7l16 0" />
                      <path d="M10 11l0 6" />
                      <path d="M14 11l0 6" />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
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
