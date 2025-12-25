import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogSlugPage } from "@/pages/blog"
import {
  getAllPosts,
  getBundleMDX,
  getPostFrontmatter,
} from "@/entities/post"

interface PageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

export default async function Page({
  params,
}: PageProps) {
  const { category, slug } = await params

  const bundledMDX = await getBundleMDX(category, slug)

  if (!bundledMDX) {
    notFound()
  }

  return (
    <BlogSlugPage category={category} frontmatter={bundledMDX.frontmatter} code={bundledMDX.code} />
  )
}

export async function generateStaticParams() {
  const posts = getAllPosts("blog")

  return posts.map(({ category, slug }) => ({
    category,
    slug,
  }))
}
