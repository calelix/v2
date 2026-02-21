import type { PostFrontmatter } from "@/entities/post"

type PostSearchItem = Pick<PostFrontmatter, "title" | "description"> & {
  category: string
  post: string
}

type GetPostsResult = PostSearchItem[]

export async function getPosts(): Promise<GetPostsResult> {
  const res = await fetch("/api/posts")

  if (!res.ok) {
    throw new Error("Failed to fetch posts.")
  }

  return res.json()
}
