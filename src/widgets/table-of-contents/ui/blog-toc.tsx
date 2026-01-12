"use client"


import * as React from "react"

import { ScrollArea } from "@/shared/ui/shadcn/scroll-area"
import { useToc } from "@/shared/lib/hooks/use-toc"
import {
  TableOfContents,
  TableOfContentsList,
  TableOfContentsTitle,
  TableOfContentsItem,
  TableOfContentsLink,
} from "@/shared/ui/table-of-contents/toc"

interface BlogTocProps extends React.ComponentProps<"div"> {
  contentId: string
}

export const BlogToc = ({
  contentId = "markdown-content",
  ...props
}: BlogTocProps) => {
  const { toc, activeId } = useToc({
    contentId: contentId,
    levels: {
      topLevel: 2,
      subLevel: 3,
    },
  })

  return (
    <div {...props}>
      <ScrollArea className="w-full max-h-[50vh] *:data-[slot=scroll-area-scrollbar]:hidden">
        <TableOfContents aria-labelledby="on-this-page-heading">
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
      </ScrollArea>
    </div>
  )
}
