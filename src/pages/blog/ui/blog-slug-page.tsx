"use client"

import {
  format,
  parseISO,
} from "date-fns"
import { ko } from "date-fns/locale"

import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
import { Giscus } from "@/widgets/comments"
import { AppBreadcrumb } from "@/widgets/breadcrumb"
import { PostNavigation } from "@/widgets/post-navigation"
import { BlogToc } from "@/widgets/table-of-contents"
import {
  type Post,
  type PostFrontmatter,
} from "@/entities/post"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"
import { MDXComponents } from "@/shared/ui/markdown/mdx-components"
import { Separator } from "@/shared/ui/shadcn/separator"

interface BlogSlugPageProps {
  category: string
  frontmatter: PostFrontmatter
  code: string
  prev: Post | null
  next: Post | null
}

export const BlogSlugPage = ({
  category,
  frontmatter,
  code,
  prev,
  next,
}: BlogSlugPageProps) => {

  return (
    <div
      style={
        {
          "--header-height": "calc(var(--spacing)*32)",
          "--footer-height": "calc(var(--spacing)*32)",
        } as React.CSSProperties
      }
    >
      <div id="container" className="overflow-y-auto max-h-svh scroll-smooth">
        <Header className="sticky top-0 z-50 h-(--header-height) bg-background" />
        <main className="relative flex container py-8 gap-8 min-h-[calc(100svh-var(--header-height)-var(--footer-height))]">
          <FadeUpContainer className="flex flex-col w-full max-w-4xl shrink-0">
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
              <article id="markdown-content" className="[&>h1]:scroll-mt-32 [&>h2]:scroll-mt-32 [&>h3]:scroll-mt-32">
                <MDXComponents code={code} />
              </article>
              <PostNavigation prev={prev} next={next} category={category} />
              <Giscus />
            </FadeUpItem>
          </FadeUpContainer>
          <BlogToc className="hidden xl:block w-48 shrink-0 sticky top-[calc(var(--header-height)+var(--spacing)*8)] self-start h-fit" />
        </main>
        <Footer className="h-(--footer-height)" />
      </div>
    </div>
  )
}
