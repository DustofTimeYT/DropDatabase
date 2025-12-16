import {
  AddSquare,
  Album,
  Gallery,
  GalleryFavourite,
  Magnifer,
  UserCircle,
  UsersGroupTwoRounded,
} from "@solar-icons/react"
import type { Icon } from "@solar-icons/react/lib/types"
import { useState } from "react"
import { NavLink, Outlet } from "react-router"
import CreatePostDialog from "./create-post-dialog"

type NavigationLink = {
  icon: Icon
  label: string
  to: string
}

const navigationLinks: NavigationLink[] = [
  {
    icon: Gallery,
    label: "Gallery",
    to: "/gallery",
  },
  {
    icon: GalleryFavourite,
    label: "Favourite",
    to: "/favourite",
  },
  {
    icon: Album,
    label: "Albums",
    to: "/albums",
  },
  {
    icon: UsersGroupTwoRounded,
    label: "Following",
    to: "/following",
  },
]

export default function MainLayout() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <CreatePostDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
      <div className="flex">
        <aside className="fixed top-0 left-0 z-50 w-64 h-screen flex flex-col">
          <div className="p-6 pb-2">
            <h1 className="text-2xl text-[#3f3f52] font-medium">Pixora</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `w-full flex flex-row items-center space-x-5 px-3 py-2 rounded-xl ${isActive && "bg-[#dedef2]"} hover:bg-[#dedef2] transition`
                }
              >
                <link.icon size={30} color="#3f3f52" />
                <p className="text-[1.125rem] text-[#3f3f52]">{link.label}</p>
              </NavLink>
            ))}
          </nav>

          <div className="p-4">
            <button
              type="button"
              className="w-full flex flex-row items-center space-x-5 px-3 py-2 rounded-xl hover:bg-[#dedef2] transition"
            >
              <UserCircle size={30} color="#3f3f52" />
              <p className="text-[1.125rem] text-[#3f3f52]">alexthvest</p>
            </button>
          </div>
        </aside>

        <main className="min-h-screen flex-1 flex flex-col ml-64 pr-4 py-4">
          <div className="flex flex-row items-center space-x-3">
            <div className="flex-1 flex flex-row items-center px-4 py-1 mb-4 h-12 rounded-xl bg-[#dedef2]">
              <Magnifer size={24} color="#3f3f52" />
              <input
                type="text"
                placeholder="Type something to search"
                className="w-full px-4 py-2 focus:outline-none text-[#3f3f52]"
              />
            </div>
            <button
              type="button"
              className="flex flex-row items-center space-x-3 px-4 py-1 mb-4 h-12 rounded-xl bg-[#dedef2]"
              onClick={() => setShowCreateDialog(true)}
            >
              <AddSquare size={24} color="#3f3f52" />
              <p className="text-[#3f3f52]">Create</p>
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </>
  )
}
