import React from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { QueryClient, QueryClientProvider } from "react-query"
import { BrowserRouter } from "react-router"

import { KeycloakProvider } from "@/auth/keycloak"
import { App } from "@/App"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <KeycloakProvider>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  </KeycloakProvider>,
)
