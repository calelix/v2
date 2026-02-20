import fs from "fs"
import path from "path"

import { cache } from "react"

import matter from "gray-matter"
import { ko } from "date-fns/locale"
import {
  format,
  parseISO,
} from "date-fns"

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

export const getAllPosts = (directory: string): Array<{ category: string; post: string }> => {
  const categories = getCategories(directory)

  return categories.flatMap(category => {
    const contentDir = path.join(process.cwd(), "content", directory, category)

    if (!fs.existsSync(contentDir)) {
      return []
    }

    const files = fs.readdirSync(contentDir)

    return files
      .filter(file => file.endsWith(".md") || file.endsWith(".mdx"))
      .map(file => ({
        category,
        post: file.replace(/\.(md|mdx)$/, ""),
      }))
  })
}

export const getCategoryMetadata = cache((directory: string, category: string): CategoryMetadata => {
  const contentDir = path.join(process.cwd(), "content", directory, category)

  if (!fs.existsSync(contentDir)) {
    throw new Error(`Category ${category} not found.`)
  }

  const metadataPath = path.join(contentDir, "metadata.json")

  return JSON.parse(fs.readFileSync(metadataPath, "utf8")) as CategoryMetadata
})

export const getPostsByCategory = cache((directory: string, category: string): CategoryWithPosts => {
  const contentDir = path.join(process.cwd(), "content", directory, category)

  if (!fs.existsSync(contentDir)) {
    throw new Error(`Category ${category} not found.`)
  }

  const metadata = getCategoryMetadata(directory, category)

  const files = fs.readdirSync(contentDir)

  const posts = files
    .filter(file => file.endsWith(".md") || file.endsWith(".mdx"))
    .map(file => {
      const filePath = path.join(contentDir, file)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data } = matter(fileContents)

      const publishedDate = parseISO(data.publishedAt as string)
      const formattedPublishedAt = format(publishedDate, "MM. dd.", { locale: ko })

      return {
        post: file.replace(/\.(md|mdx)$/, ""),
        frontmatter: {
          ...data,
          formattedPublishedAt,
        } as Post["frontmatter"],
      }
    })
    .filter(post => post.frontmatter.status === "published")
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.publishedAt).getTime()
      const dateB = new Date(b.frontmatter.publishedAt).getTime()
      return dateB - dateA
    })

  return {
    category,
    metadata,
    posts,
  }
})

export const groupPostsByYear = (posts: Post[]) => {
  const map = new Map<number, Post[]>()

  posts.forEach(post => {
    const year = new Date(post.frontmatter.publishedAt).getFullYear()

    if (!map.has(year)) {
      map.set(year, [])
    }

    const yearPosts = map.get(year)

    if (yearPosts) {
      yearPosts.push(post)
    }
  })

  return Array.from(map.entries()).map(([year, posts]) => ({
    year,
    posts,
  }))
}

export const getAdjacentPost = cache((
  directory: string,
  category: string,
  post: string
) => {
  const { posts } = getPostsByCategory(directory, category)

  const index = posts.findIndex(p => p.post === post)

  const isPostNotFound = index === -1

  if (isPostNotFound) {
    return {
      prev: null,
      next: null,
    }
  }

  const older = posts[index + 1] ?? null
  const newer = posts[index - 1] ?? null

  return {
    prev: older,
    next: newer,
  }
})
