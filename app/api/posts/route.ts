import { NextResponse } from "next/server"

import {
  getCategories,
  getPostsByCategory,
} from "@/entities/post"

export const dynamic = "force-static"

export async function GET() {
  const categories = getCategories("blog")

  const posts = categories.flatMap(category => {
    const { posts } = getPostsByCategory("blog", category)

    return posts.map(post => ({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      category,
      post: post.post,
    }))
  })

  return NextResponse.json(posts)
}
