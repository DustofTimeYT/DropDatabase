import type { PropsWithChildren } from "react"
import { useQuery, type QueryKey } from "react-query"

import Keycloak from "keycloak-js"
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web"

const keycloakClient = new Keycloak({
  url: "http://localhost:5003/",
  realm: "pixora",
  clientId: "pixora-web",
})

export const KeycloakProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ReactKeycloakProvider authClient={keycloakClient}>
      {children}
    </ReactKeycloakProvider>
  )
}

export const useAuthenticatedQuery = <
  T = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  key: TQueryKey,
  fn: (keycloak: Keycloak) => T | Promise<T>,
) => {
  const { keycloak } = useKeycloak()
  return useQuery(key, () => fn(keycloak))
}
