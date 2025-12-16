import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router"

import "./main.css"
import { router } from "./router"

// biome-ignore lint/style/noNonNullAssertion: declared in index.html
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
)
