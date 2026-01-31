import Link from "next/link"

import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
} from "@tabler/icons-react"

import { type Post } from "@/entities/post"
import { ScrollToTopButton } from "@/shared/ui/scroll-top/scroll-top-button"
import { Button } from "@/shared/ui/shadcn/button"

interface PostNavigationProps {
  prev: Post | null
  next: Post | null
  category: string
}

export const PostNavigation = ({
  prev,
  next,
  category,
}: PostNavigationProps) => {

  return (
    <div className="flex flex-col gap-8 mt-12 pt-8">
      <div className="flex items-center justify-end">
        <ScrollToTopButton
          container="#container"
          visibilityMode="always"
          variant="ghost"
          size="icon-lg"
          className="rounded-full border border-border"
        >
          <IconArrowUp />
          <span className="sr-only">Scroll to top</span>
        </ScrollToTopButton>
      </div>
      <nav className="grid grid-cols-2 gap-4">
        {prev && (
          <div className="grid justify-items-start">
            <Button variant="outline" size="lg" asChild>
              <Link href={`/blog/${category}/${prev.slug}`} className="flex flex-col gap-2">
                <div className="flex items-center justify-end gap-2">
                  <IconArrowLeft className="size-4" />
                  <span>
                    {prev.frontmatter.title}
                  </span>
                </div>
              </Link>
            </Button>
          </div>
        )}
        {next && (
          <div className="grid col-[2/3] justify-items-end">
            <Button variant="outline" size="lg" asChild>
              <Link href={`/blog/${category}/${next.slug}`} className="flex flex-col gap-2">
                <div className="flex items-center justify-end gap-2">
                  <span>
                    {next.frontmatter.title}
                  </span>
                  <IconArrowRight className="size-4" />
                </div>
              </Link>
            </Button>
          </div>
        )}
      </nav>
    </div>
  )
}
