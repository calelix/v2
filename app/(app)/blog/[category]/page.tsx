import type { Metadata } from "next"

import { BlogCategoryPage } from "@/pages/blog/category"
import {
  getCategories,
  getCategoryMetadata,
  getPostsByCategory,
  groupPostsByYear,
} from "@/entities/post"

export default async function Page({
  params,
}: PageProps<"/blog/[category]">) {
  const { category } = await params
  const categoryData = getPostsByCategory("blog", category)

  const postsByYear = groupPostsByYear(categoryData.posts)

  return (
    <BlogCategoryPage category={category} metadata={categoryData.metadata} posts={postsByYear} />
  )
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[category]">): Promise<Metadata> {
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
