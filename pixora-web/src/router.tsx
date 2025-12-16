import { createBrowserRouter, Navigate } from "react-router"
import AlbumsPage from "./app/albums/page"
import FavouritePage from "./app/favourite/page"
import FollowingPage from "./app/following/page"
import GalleryPage from "./app/gallery/page"
import LoginPage from "./app/login/page"
import PostPage from "./app/post/page"
import MainLayout from "./components/main-layout"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/gallery" replace />,
      },
      {
        path: "/gallery",
        element: <GalleryPage />,
      },
      {
        path: "/favourite",
        element: <FavouritePage />,
      },
      {
        path: "/albums",
        element: <AlbumsPage />,
      },
      {
        path: "/following",
        element: <FollowingPage />,
      },
      {
        path: "/posts/:postId",
        element: <PostPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
])
