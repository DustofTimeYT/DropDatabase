import Keycloak from "keycloak-js"

export interface Post {
  readonly id: string
  readonly user_id: string
  readonly images: PostImage[]
  readonly created_at: Date
}

export interface PostImage {
  readonly id: string
  readonly width: number
  readonly height: number
}

export async function fetchPosts(keycloak: Keycloak): Promise<Post[]> {
  const response = await fetch("http://localhost:5004/v1/posts/all", {
    headers: {
      "Authorization": `Bearer ${keycloak.token}`
    }
  });

  const posts: Post[] = await response.json();
  return posts;
}

export async function fetchUserPosts(keycloak: Keycloak): Promise<Post[]> {
  const response = await fetch("http://localhost:5004/v1/posts/user", {
    headers: {
      "Authorization": `Bearer ${keycloak.token}`
    }
  });

  const posts: Post[] = await response.json();
  return posts;
}
