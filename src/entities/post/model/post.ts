/**
 * Post status
 * - published: 공개적으로 게시된 상태
 * - draft: 아직 완성되지 않은 초안 상태
 * - archived: 더 이상 활성 상태가 아니며, 기록용으로 보관된 상태
 */
export type PostStatus = "published" | "draft" | "archived"

export interface PostFrontmatter {
  status: PostStatus
  title: string
  description: string
  publishedAt: string
  author: {
    name: string
    picture?: string
    github?: string
    email?: string
    phone?: string
  }
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
}

