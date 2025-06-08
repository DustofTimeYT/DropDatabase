import React from "react"

import { Outlet } from "react-router"

import { NavigationBar } from "@/components/NavigationBar"

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="px-16">
        <Outlet />
      </div>
    </div>
  )
}
