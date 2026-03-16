import * as React from "react"

import GithubSlugger from "github-slugger"

type TableOfContent = TableOfContentItem & {
  children: TableOfContentItem[]
}

interface TableOfContentItem {
  slug: string
  text: string
}

interface TableOfContentLevel {
  topLevel: number
  subLevel?: number
}

interface UseTocOptions {
  contentId: string
  levels: TableOfContentLevel
}

export const useToc = ({
  contentId,
  levels,
}: UseTocOptions) => {
  const [activeId, setActiveId] = React.useState("")
  const [toc, setToc] = React.useState<TableOfContent[]>([])

  const headingsRef = React.useRef<HTMLElement[]>([])
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const visibleHeadingsRef = React.useRef<Set<string>>(new Set())

  const selectors = React.useMemo(() => {
    return levels.subLevel
      ? Array.from(
        { length: levels.subLevel - levels.topLevel + 1 },
        (_, i) => `#${contentId} h${levels.topLevel + i}`
      )
      : [`#${contentId} h${levels.topLevel}`]
  }, [contentId, levels.topLevel, levels.subLevel])

  const getOffset = React.useCallback(() => {
    const headings = headingsRef.current

    if (headings.length > 0) {
      const firstHeading = headings[0]

      if (firstHeading) {
        const computedStyle = window.getComputedStyle(firstHeading)
        const scrollMargin = parseFloat(computedStyle.scrollMarginTop) || 0

        return scrollMargin
      }
    }

    return 0
  }, [])

  const updateActiveId = React.useCallback(() => {
    const headings = headingsRef.current
    const visibleIds = visibleHeadingsRef.current

    if (headings.length === 0 || visibleIds.size === 0) {
      return
    }

    let topMostHeading: HTMLElement | null = null
    let topMostPosition = Infinity

    for (const heading of headings) {
      if (visibleIds.has(heading.id)) {
        const rect = heading.getBoundingClientRect()

        if (rect.top < topMostPosition) {
          topMostPosition = rect.top
          topMostHeading = heading
        }
      }
    }

    if (topMostHeading && topMostHeading.id !== activeId) {
      setActiveId(topMostHeading.id)
    }
  }, [activeId])

  const handleIntersection = React.useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const headingId = entry.target.id

      if (entry.isIntersecting) {
        visibleHeadingsRef.current.add(headingId)
      } else {
        visibleHeadingsRef.current.delete(headingId)
      }
    })

    updateActiveId()
  }, [updateActiveId])

  React.useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(selectors.join(", "))
    )

    headingsRef.current = headings

    const offset = getOffset()
    const tocItems: TableOfContent[] = []
    let currentTopLevelItem: TableOfContent | null = null

    headings.forEach((heading) => {
      const headingText = heading.textContent || ""
      const { slug, text } = getHeadingInfo(headingText)

      if (!heading.id) {
        heading.id = slug
      }

      const item: TableOfContent = {
        slug,
        text,
        children: [],
      }

      const level = parseInt(heading.tagName.substring(1), 10)

      if (level === levels.topLevel) {
        currentTopLevelItem = item
        tocItems.push(item)
      } else if (level > levels.topLevel && currentTopLevelItem) {
        currentTopLevelItem.children.push(item)
      }
    })

    setToc(tocItems)

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: `-${offset}px 0px -80% 0px`,
      threshold: 0,
    })

    headings.forEach((heading) => {
      if (observerRef.current) {
        observerRef.current.observe(heading)
      }
    })

    const currentObserver = observerRef.current
    const currentVisibleHeadings = visibleHeadingsRef.current

    return () => {
      if (currentObserver) {
        currentObserver.disconnect()
      }
      currentVisibleHeadings.clear()
    }
  }, [selectors, levels.topLevel, getOffset, handleIntersection])

  return {
    toc,
    activeId,
  }
}

const getHeadingInfo = (headingLine: string) => {
  const headingText = headingLine.trim()
  const textWithoutNumber = headingText.replace(/^\d+\.\s+/, "")

  const slugger = new GithubSlugger()

  return {
    slug: slugger.slug(headingText),
    text: textWithoutNumber,
  }
}
