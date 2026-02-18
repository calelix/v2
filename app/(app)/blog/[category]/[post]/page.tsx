import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogPostPage } from "@/pages/blog/post"
import {
  getAdjacentPost,
  getAllPosts,
  getBundleMDX,
  getPostFrontmatter,
} from "@/entities/post"

export default async function Page({
  params,
}: PageProps<"/blog/[category]/[post]">) {
  const { category, post } = await params

  const bundledMDX = await getBundleMDX(category, post)

  if (!bundledMDX) {
    notFound()
  }

  const { prev, next } = getAdjacentPost("blog", category, post)

  return (
    <BlogPostPage
      category={category}
      frontmatter={bundledMDX.frontmatter}
      code={bundledMDX.code}
      prev={prev}
      next={next}
    />
  )
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[category]/[post]">): Promise<Metadata> {
  const { category, post } = await params
  const frontmatter = await getPostFrontmatter(category, post)

  if (!frontmatter) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    }
  }

  return {
    title: `${frontmatter.title} | JGPARK`,
    description: frontmatter.description,
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts("blog")

  return posts.map(({ category, post }) => ({
    category,
    post,
  }))
}
