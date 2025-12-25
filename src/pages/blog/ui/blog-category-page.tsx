import Link from "next/link"

import {
  format,
  parseISO,
} from "date-fns"
import { IconArrowRight } from "@tabler/icons-react"

import { Header } from "@/widgets/header"
import { AppBreadcrumb } from "@/widgets/breadcrumb"
import {
  type Post,
  type CategoryMetadata,
  EmptyPost,
} from "@/entities/post"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"
import { Separator } from "@/shared/ui/shadcn/separator"

interface BlogCategoryPageProps {
  category: string
  metadata: CategoryMetadata
  posts: Post[]
}

export const BlogCategoryPage = ({
  category,
  metadata,
  posts,
}: BlogCategoryPageProps) => {
  const isEmptyPosts = posts.length === 0

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
              {metadata.name}
            </h1>
          </FadeUpItem>
          <FadeUpItem>
            <p className="mt-4 text-xs/relaxed text-muted-foreground">
              {metadata.description}
            </p>
          </FadeUpItem>
          <FadeUpItem>
            <Separator className="my-8 lg:my-12" />
          </FadeUpItem>
          <FadeUpItem>
            <div className="flex flex-col gap-8">
              {posts.map((post) => (
                <article key={post.slug}>
                  <Link href={`/blog/${category}/${post.slug}`} className="group flex flex-row items-start justify-between gap-2">
                    <div className="hidden md:flex md:w-1/5 justify-start">
                      <div className="flex flex-col gap-2 md:gap-4 min-w-0">
                        <time dateTime={post.frontmatter.publishedAt} className="text-xs/relaxed text-muted-foreground">
                          {format(parseISO(post.frontmatter.publishedAt), "dd MMM yyyy")}
                        </time>
                      </div>
                    </div>
                    <div className="flex w-full md:w-3/5 justify-start">
                      <div className="flex flex-col gap-2 md:gap-4 min-w-0">
                        <h2 className="text-base font-semibold">
                          {post.frontmatter.title}
                        </h2>
                        <p className="truncate text-xs/relaxed text-muted-foreground">
                          {post.frontmatter.description}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex md:w-1/5 justify-end">
                      <div className="group flex flex-col gap-2 md:gap-4 min-w-0">
                        <span className="text-xs/relaxed group-hover:underline group-hover:underline-offset-4 group-hover:decoration-muted-foreground">
                          Learn More
                        </span>
                        <IconArrowRight className="size-4" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}

              {isEmptyPosts && (
                <EmptyPost backUrl="/blog" />
              )}
            </div>
          </FadeUpItem>
        </FadeUpContainer>
      </main>
    </div>
  )
}
