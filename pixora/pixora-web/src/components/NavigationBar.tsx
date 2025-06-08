import React, { useState, useEffect, useCallback } from "react"
import { NavLink } from "react-router"

import { useKeycloak } from "@react-keycloak/web"

import type { KeycloakProfile } from "keycloak-js"

import { albums } from "@/data"

type NavLinkItem = {
  id: number
  name: string
  icon: React.ReactNode
  to: string
}

const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z" />
    <path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z" />
  </svg>
)

const FeedIcon = () => (
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
    className="w-4 h-4"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
    <path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" />
    <path d="M17 7h.01" />
    <path d="M7 13l3.644 -3.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" />
    <path d="M15 12l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l2.644 2.644" />
  </svg>
)

const SearchIcon = () => (
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
    className="w-4 h-4"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <path d="M21 21l-6 -6" />
  </svg>
)

const AlbumIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M20.894 15.553a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.553 3.774l7.554 -3.775a1 1 0 0 1 1.341 .447m0 -4a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.552 3.775l7.554 -3.775a1 1 0 0 1 1.341 .447m-8.887 -8.552q .056 0 .111 .007l.111 .02l.086 .024l.012 .006l.012 .002l.029 .014l.05 .019l.016 .009l.012 .005l8 4a1 1 0 0 1 0 1.788l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 0 -1.788l8 -4l.011 -.005l.018 -.01l.078 -.032l.011 -.002l.013 -.006l.086 -.024l.11 -.02l.056 -.005z" />
  </svg>
)

const PictureIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8.813 11.612c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.986 4.986l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l.292 -.293l.106 -.095c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.674 4.675a4 4 0 0 1 -3.775 3.599l-.206 .005h-12a4 4 0 0 1 -3.98 -3.603l6.687 -6.69l.106 -.095zm9.187 -9.612a4 4 0 0 1 3.995 3.8l.005 .2v9.585l-3.293 -3.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-.307 .306l-2.293 -2.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-5.307 5.306v-9.585a4 4 0 0 1 3.8 -3.995l.2 -.005h12zm-2.99 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
  </svg>
)

export const NavigationBar: React.FC = () => {
  const { keycloak } = useKeycloak()
  const [userProfile, setUserProfile] = useState<KeycloakProfile>()

  // Navigation links
  const navLinks: NavLinkItem[] = [
    { id: 1, name: "Feed", icon: <FeedIcon />, to: "/" },
    { id: 2, name: "Search", icon: <SearchIcon />, to: "/search" },
    { id: 3, name: "My Albums", icon: <AlbumIcon />, to: "/albums" },
    { id: 4, name: "My Posts", icon: <PictureIcon />, to: "/posts" },
  ]

  const handleLogout = useCallback(
    () =>
      keycloak.logout({
        redirectUri: "http://localhost:5002/",
      }),
    [keycloak],
  )

  useEffect(() => {
    keycloak.loadUserProfile().then(setUserProfile)
  }, [keycloak])

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white flex flex-col p-3 border-r-2 border-gray-100">
      {/* User Profile */}
      <div
        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-all cursor-pointer rounded-lg relative"
        onClick={handleLogout}
      >
        <div className="flex items-center space-x-3">
          <img className="rounded-full w-8 h-8" src="/avatar.png" />
          <span className="font-medium text-sm text-gray-800">
            {userProfile?.username}
          </span>
        </div>

        <div className="p-1 rounded-full hover:bg-gray-100 cursor-pointer relative">
          <BellIcon />
        </div>
      </div>

      <div className="border-t-2 rounded-full border-gray-100 my-3"></div>

      {/* Navigation Links */}
      <div className="space-y-0.5">
        {navLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <div>{link.icon}</div>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Separator */}
      <div className="border-t-2 rounded-full border-gray-100 my-3"></div>

      {/* User Albums */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-2">
          Recent Albums
        </h3>
        <div className="space-y-1">
          {albums.slice(0, 5).map((album) => (
            <div
              key={album.id}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div
                className="flex-shrink-0 bg-gray-200 rounded w-7 h-7"
                style={{
                  backgroundImage: `url(${album.coverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <span className="text-sm text-gray-700 transition-colors truncate">
                {album.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
