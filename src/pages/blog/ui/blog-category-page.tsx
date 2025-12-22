import Link from "next/link"

import {
  format,
  parseISO,
} from "date-fns"

import { Header } from "@/widgets/header"
import {
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
  posts: any[]
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
      <main className="w-full max-w-2xl mx-auto h-[calc(100svh-(var(--header-height)))]">
        <FadeUpContainer className="flex flex-col">
          <FadeUpItem>
            <h1 className="text-base font-bold">
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
                  <div className="flex flex-row items-start justify-between">
                    <div className="flex flex-col basis-1/5">
                      <time
                        dateTime={post.frontmatter.publishedAt}
                        className="text-xs/relaxed text-muted-foreground"
                      >
                        {format(parseISO(post.frontmatter.publishedAt), "dd MMM yyyy")}
                      </time>
                    </div>
                    <div className="flex flex-col basis-3/5">
                      <h2 className="truncate text-sm font-semibold">
                        {post.frontmatter.title}
                      </h2>
                      <p className="truncate mt-4 text-xs/relaxed text-muted-foreground">
                        {post.frontmatter.description}
                      </p>
                    </div>
                    <div className="flex flex-col basis-1/5 items-end">
                      <Link
                        href={`/blog/${category}/${post.slug}`}
                        className="text-xs/relaxed hover:underline hover:underline-offset-2"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
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
