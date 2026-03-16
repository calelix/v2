import Link from "next/link"

import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
import { AppBreadcrumb } from "@/widgets/breadcrumb"
import {
  type Post,
  type CategoryMetadata,
  EmptyPost,
} from "@/entities/post"
import { cn } from "@/shared/lib/classnames/cn"
import { Separator } from "@/shared/ui/shadcn/separator"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"

interface BlogCategoryPageProps {
  category: string
  metadata: CategoryMetadata
  posts: {
    year: number
    posts: Post[]
  }[]
}

export const BlogCategoryPage = ({
  category,
  metadata,
  posts,
}: BlogCategoryPageProps) => {
  const isEmptyPosts = posts.length === 0

  return (
    <>
      <Header className="h-(--header-height) bg-background" />
      <main className="relative flex gap-8 container py-8 min-h-[calc(100svh-var(--page-spacing))]">
        <FadeUpContainer className="flex flex-col w-full max-w-4xl shrink-0">
          <FadeUpItem>
            <AppBreadcrumb />
          </FadeUpItem>
          <FadeUpItem>
            <h1 className="mt-8 text-lg font-bold">
              {metadata.name}
            </h1>
          </FadeUpItem>
          <FadeUpItem>
            <p className="mt-4 text-xs/loose text-body">
              {metadata.description}
            </p>
          </FadeUpItem>
          <FadeUpItem>
            <Separator className="my-8 lg:my-12" />
          </FadeUpItem>
          <FadeUpItem>
            <div className="group flex flex-col">
              {posts.map(({ year, posts }, yearIndex) => (
                <div key={year} className={cn("border-b flex-1 flex items-start", yearIndex === 0 && "border-t")}>
                  <div className="w-16 shrink-0 text-sm text-muted-foreground/75 py-4">
                    {year}
                  </div>
                  <div className="flex-1 flex flex-col ml-8">
                    {posts.map((post, postIndex) => (
                      <div key={`${year}-${post.post}`} className="group/post relative flex-1">
                        {postIndex !== 0 && (
                          <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
                        )}
                        <Link href={`/blog/${category}/${post.post}`} className="flex items-center cursor-pointer py-4">
                          <p className="flex-1 min-w-0 text-sm font-medium truncate transition-colors group-hover:text-muted-foreground/75 group-hover/post:text-foreground">
                            {post.frontmatter.title}
                          </p>
                          <time
                            dateTime={post.frontmatter.publishedAt}
                            className="w-16 shrink-0 text-xs text-right tabular-nums transition-colors text-muted-foreground/75 group-hover:text-muted-foreground/25 group-hover/post:text-muted-foreground"
                          >
                            {post.frontmatter.formattedPublishedAt}
                          </time>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {isEmptyPosts && <EmptyPost backUrl="/blog" />}
            </div>
          </FadeUpItem>
        </FadeUpContainer>
      </main>
      <Footer className="h-(--footer-height)" />
    </>
  )
}
