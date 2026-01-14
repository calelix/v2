"use client"


import * as React from "react"

import { IconArrowUp } from "@tabler/icons-react"
import { useInView } from "react-intersection-observer"

import { cn } from "@/shared/lib/utils/tailwindcss"
import { useToc } from "@/shared/lib/hooks/use-toc"
import { ScrollToTopButton } from "@/shared/ui/scroll-top/scroll-top-button"
import {
  TableOfContents,
  TableOfContentsList,
  TableOfContentsTitle,
  TableOfContentsItem,
  TableOfContentsLink,
} from "@/shared/ui/table-of-contents/toc"

interface BlogTocProps extends React.ComponentProps<"div"> {
  contentId?: string
}

export const BlogToc = ({
  contentId = "markdown-content",
  ...props
}: BlogTocProps) => {
  const [rootElement, setRootElement] = React.useState<HTMLDivElement | null>(null)

  const { toc, activeId } = useToc({
    contentId: contentId,
    levels: {
      topLevel: 2,
      subLevel: 3,
    },
  })

  const {
    ref: topRef,
    inView: isAtTop,
  } = useInView({
    root: rootElement,
    threshold: 0,
  })

  const {
    ref: bottomRef,
    inView: isAtBottom,
  } = useInView({
    root: rootElement,
    threshold: 0,
  })

  const setScrollContainerRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setRootElement(node)
    }
  }, [])

  return (
    <div {...props}>
      <div className="relative">
        <div
          className={cn("pointer-events-none absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-background to-transparent", {
            "hidden": isAtTop,
          })}
        />
        <div ref={setScrollContainerRef} className="w-full h-[50vh] overflow-y-auto">
          <div className="w-full h-full">
            <div ref={topRef} className="pointer-events-none h-0" />
            <TableOfContents aria-labelledby="on-this-page-heading" className="h-fit">
              <TableOfContentsTitle id="on-this-page-heading" className="sticky top-0 bg-background h-6 text-xs/relaxed">
                On This Page
              </TableOfContentsTitle>
              <TableOfContentsList className="w-full text-xs/relaxed text-muted-foreground">
                {toc.map((item) => (
                  <TableOfContentsItem key={item.slug} indent>
                    <TableOfContentsLink href={`#${item.slug}`} isActive={activeId === item.slug}>
                      {item.text}
                    </TableOfContentsLink>
                    {item.children.length > 0 && (
                      <TableOfContentsList>
                        {item.children.map((child) => (
                          <TableOfContentsItem key={child.slug} indent>
                            <TableOfContentsLink href={`#${child.slug}`} isActive={activeId === child.slug}>
                              {child.text}
                            </TableOfContentsLink>
                          </TableOfContentsItem>
                        ))}
                      </TableOfContentsList>
                    )}
                  </TableOfContentsItem>
                ))}
              </TableOfContentsList>
            </TableOfContents>
            <div ref={bottomRef} className="pointer-events-none h-0" />
          </div>
        </div>
        <div
          className={cn("pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent", {
            "hidden": isAtBottom,
          })}
        />
      </div>
      <div className="mt-4">
        <ScrollToTopButton
          container="#container"
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent dark:hover:bg-transparent"
        >
          <span>Scroll to top</span>
          <IconArrowUp />
        </ScrollToTopButton>
      </div>
    </div>
  )
}
