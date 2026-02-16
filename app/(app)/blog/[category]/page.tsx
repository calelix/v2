import type { Metadata } from "next"

import { BlogCategoryPage } from "@/pages/blog"
import {
  getCategories,
  getCategoryMetadata,
  getPostsByCategory,
  groupPostsByYear,
} from "@/entities/post"

interface PageProps {
  params: Promise<{
    category: string
  }>
}

export default async function Page({
  params,
}: PageProps) {
  const { category } = await params
  const categoryData = getPostsByCategory("blog", category)

  const postsByYear = groupPostsByYear(categoryData.posts)

  return (
    <BlogCategoryPage category={category} metadata={categoryData.metadata} posts={postsByYear} />
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params
  const metadata = getCategoryMetadata("blog", category)

  return {
    title: `${metadata.name} | JGPARK`,
    description: metadata.description,
  }
}

export async function generateStaticParams() {
  const categories = getCategories("blog")

  return categories.map((category) => ({
    category,
  }))
}
