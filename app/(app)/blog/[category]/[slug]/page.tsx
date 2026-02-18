import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogSlugPage } from "@/pages/blog"
import {
  getAdjacentPost,
  getAllPosts,
  getBundleMDX,
  getPostFrontmatter,
} from "@/entities/post"

export default async function Page({
  params,
}: PageProps<"/blog/[category]/[slug]">) {
  const { category, slug } = await params

  const bundledMDX = await getBundleMDX(category, slug)

  if (!bundledMDX) {
    notFound()
  }

  const { prev, next } = getAdjacentPost("blog", category, slug)

  return (
    <BlogSlugPage
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
}: PageProps<"/blog/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params
  const frontmatter = await getPostFrontmatter(category, slug)

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

  return posts.map(({ category, slug }) => ({
    category,
    slug,
  }))
}
