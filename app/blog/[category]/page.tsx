import { BlogCategoryPage } from "@/pages/blog"
import {
  getCategories,
  getPostsByCategory,
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

  return (
    <BlogCategoryPage category={category} metadata={categoryData.metadata} posts={categoryData.posts} />
  )
}

export async function generateStaticParams() {
  const categories = getCategories("blog")

  return categories.map((category) => ({
    category,
  }))
}
