import React, { useState } from "react"

import { albums } from "@/data"
import {
  CreateAlbumDialog,
  type CreateAlbumRequest,
} from "@/components/CreateAlbumDialog"

export const UserAlbumsPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateAlbum = (req: CreateAlbumRequest) => {
    console.log("New album created:", req)
  }

  return (
    <div className="ml-56 p-6">
      {/* Create Album Dialog */}
      <CreateAlbumDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateAlbum}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Albums</h1>
        <p className="text-gray-500 mt-1">
          Collections of your favorite moments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div
          className="w-full h-full group relative bg-blue-100 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-100 transition-colors"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </div>

        {albums.map((album) => (
          <div
            key={album.id}
            className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl aspect-square"
          >
            {/* Album cover */}
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${album.coverUrl})` }}
            />

            {/* Photo count badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-800 shadow-sm">
              {album.photoCount} photos
            </div>

            {/* Album name overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-lg font-medium truncate">
                {album.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
