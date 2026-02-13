import Link from "next/link"

import { IconArrowRight } from "@tabler/icons-react"

import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
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
    <>
      <Header className="h-(--header-height) bg-background" />
      <main className="relative flex container py-8 gap-8 min-h-[calc(100svh-var(--header-height)-var(--footer-height))]">
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
                  <Link href={`/blog/${category}/${post.slug}`} className="flex flex-row items-start justify-between gap-2">
                    <div className="hidden md:flex md:w-1/5 justify-start">
                      <div className="flex flex-col gap-2 md:gap-4 min-w-0">
                        <time dateTime={post.frontmatter.publishedAt} className="text-xs/relaxed text-muted-foreground">
                          {post.frontmatter.formattedPublishedAt}
                        </time>
                      </div>
                    </div>
                    <div className="flex w-full md:w-3/5 justify-start">
                      <div className="flex flex-col gap-2 md:gap-4 min-w-0">
                        <h2 className="text-base font-semibold hover:underline hover:underline-offset-4 hover:decoration-muted-foreground">
                          {post.frontmatter.title}
                        </h2>
                        <p className="line-clamp-1 text-xs/relaxed text-muted-foreground">
                          {post.frontmatter.description}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex md:w-1/5 justify-end">
                      <div className="group flex flex-col gap-2 md:gap-4 min-w-0">
                        <span className="text-xs/relaxed group-hover:underline group-hover:underline-offset-4 group-hover:decoration-muted-foreground">
                          Read more
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
      <Footer className="h-(--footer-height)" />
    </>
  )
}
