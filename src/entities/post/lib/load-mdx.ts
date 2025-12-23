import { promises } from "fs"
import path from "path"
import matter from "gray-matter"
import { bundleMDX } from "mdx-bundler"

import { PostFrontmatter } from "../model/post"

export const DATA_PATH = path.join(process.cwd(), "content/blog")

export const getBundleMDX = async (category: string, slug: string) => {
  const source = await getMarkdownContent(category, slug)

  if (!source) {
    return undefined
  }

  const { code } = await bundleMDX({
    source: source.content,
    cwd: process.cwd(),
  })

  return {
    frontmatter: source.frontmatter as PostFrontmatter,
    code
  }
}

const getMarkdownContent = async (category: string, slug: string) => {
  const filePath = path.join(DATA_PATH, category, `${slug}.mdx`)

  const fileContents = await promises.readFile(filePath, "utf8").catch(() => undefined)

  if (!fileContents) {
    return undefined
  }

  const { data, content } = matter(fileContents)

  return {
    frontmatter: data,
    content,
  }
}
