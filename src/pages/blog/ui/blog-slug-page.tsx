import {
  format,
  parseISO,
} from "date-fns"

import { Header } from "@/widgets/header"
import { Giscus } from "@/widgets/comments"
import { AppBreadcrumb } from "@/widgets/breadcrumb"
import { type PostFrontmatter } from "@/entities/post"
import { MDXComponents } from "@/shared/ui/markdown/mdx-components"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"
import { Separator } from "@/shared/ui/shadcn/separator"

interface BlogSlugPageProps {
  frontmatter: PostFrontmatter
  code: string
}

export const BlogSlugPage = ({
  frontmatter,
  code,
}: BlogSlugPageProps) => {

  return (
    <div
      className="px-4 lg:px-0"
      style={
        {
          "--header-height": "calc(var(--spacing)*32)",
        } as React.CSSProperties
      }
    >
      <Header className="h-32" />
      <main className="w-full max-w-2xl mx-auto">
        <FadeUpContainer className="flex flex-col">
          <FadeUpItem>
            <AppBreadcrumb />
          </FadeUpItem>
          <FadeUpItem>
            <h1 className="mt-8 text-lg font-bold">
              {frontmatter.title}
            </h1>
          </FadeUpItem>
          <FadeUpItem>
            <p className="mt-4 text-xs/relaxed text-muted-foreground">
              Published on {format(parseISO(frontmatter.publishedAt), "MMMM dd, yyyy")}
            </p>
          </FadeUpItem>
          <FadeUpItem>
            <p className="mt-4 text-xs/relaxed">
              {frontmatter.description}
            </p>
          </FadeUpItem>
          <FadeUpItem>
            <Separator className="my-8 lg:my-12" />
          </FadeUpItem>
          <FadeUpItem>
            <div id="markdown-content">
              <MDXComponents code={code} />
            </div>
            <Giscus />
          </FadeUpItem>
        </FadeUpContainer>
      </main>
    </div>
  )
}
