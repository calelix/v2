import fs from "fs"
import path from "path"
import matter from "gray-matter"

import {
  type CategoryWithPosts,
  type CategoryMetadata,
} from "../model/category"
import { type Post } from "../model/post"

export const getCategories = (directory: string): string[] => {
  const contentDir = path.join(process.cwd(), "content", directory)

  if (!fs.existsSync(contentDir)) {
    return []
  }

  const items = fs.readdirSync(contentDir, { withFileTypes: true })

  return items
    .filter(item => item.isDirectory())
    .map(item => item.name)
}

export const getPostsByCategory = (directory: string, category: string): CategoryWithPosts => {
  const contentDir = path.join(process.cwd(), "content", directory, category)

  if (!fs.existsSync(contentDir)) {
    throw new Error(`Category ${category} not found.`)
  }

  const metadataPath = path.join(contentDir, "metadata.json")

  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8")) as CategoryMetadata

  const files = fs.readdirSync(contentDir)

  const posts = files
    .filter(file => file.endsWith(".md") || file.endsWith(".mdx"))
    .map(file => {
      const filePath = path.join(contentDir, file)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data } = matter(fileContents)

      return {
        slug: file.replace(/\.(md|mdx)$/, ""),
        frontmatter: data as Post["frontmatter"],
      }
    })
    .filter(post => post.frontmatter.status === "published")

  return {
    category,
    metadata,
    posts,
  }
}
