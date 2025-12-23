import { notFound } from "next/navigation"

import { BlogSlugPage } from "@/pages/blog"
import { getBundleMDX } from "@/entities/post"

interface PageProps {
  params: Promise<{
    category: string
    slug: string
  }>
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
