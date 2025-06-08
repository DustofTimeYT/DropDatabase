import React from "react"

import { Routes, Route } from "react-router"

import { MainLayout } from "@/components/MainLayout"

import { LoginPage } from "@/pages/LoginPage"
import { HomePage } from "@/pages/HomePage"
import { useKeycloak } from "@react-keycloak/web"
import { UserAlbumsPage } from "@/pages/UserAlbumsPage"
import { UserPostsPage } from "@/pages/UserPostsPage"

export const App: React.FC = () => {
  const { keycloak, initialized } = useKeycloak()

  if (!initialized) {
    return <>Loading...</>
  }

  return (
    <Routes>
      {keycloak.authenticated && (
        <Route path="/" element={<MainLayout />}>
          <Route index path="/" element={<HomePage />} />
          <Route path="/albums" element={<UserAlbumsPage />} />
          <Route path="/posts" element={<UserPostsPage />} />
        </Route>
      )}
      {!keycloak.authenticated && (
        <Route index path="/" element={<LoginPage />} />
      )}
    </Routes>
  )
}
