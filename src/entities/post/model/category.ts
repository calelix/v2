import type { Post } from "./post"

export interface Category {
  post: string
  name: string
  description: string
  order?: number
}

export interface CategoryMetadata {
  name: string
  description: string
}

export interface CategoryWithPosts {
  category: string
  metadata: CategoryMetadata
  posts: Post[]
}

