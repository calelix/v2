import { type PostFrontmatter } from "@/entities/post"
import { MDXComponents } from "@/shared/ui/markdown/mdx-components"

interface BlogSlugPageProps {
  frontmatter: PostFrontmatter
  code: string
}

export const BlogSlugPage = ({
  frontmatter,
  code,
}: BlogSlugPageProps) => {

  return (
    <MDXComponents code={code} />
  )
}
