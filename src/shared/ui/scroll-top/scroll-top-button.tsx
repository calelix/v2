"use client"

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
} from "react"

import { cn } from "@/shared/lib/classnames/cn"
import { Button } from "@/shared/ui/shadcn/button"

const SHOW_AFTER_SCROLL_POSITION = 300

type VisibilityMode = "always" | "scroll"

interface ScrollToTopButtonProps extends React.ComponentProps<typeof Button> {
  container?: string
  visibilityMode?: VisibilityMode
}

export const ScrollToTopButton = ({
  children,
  className,
  container,
  visibilityMode = "scroll",
  ...rest
}: ScrollToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(visibilityMode === "always")

  const scrollContainerRef = useRef<HTMLElement | Window | null>(null)

  const toggleVisibility = useCallback(() => {
    const current = scrollContainerRef.current
    if (!current) return

    const scrollTop = current === window
      ? window.scrollY
      : (current as HTMLElement).scrollTop

    startTransition(() => {
      setIsVisible(scrollTop > SHOW_AFTER_SCROLL_POSITION)
    })
  }, [])

  const scrollToTop = useCallback(() => {
    const current = scrollContainerRef.current
    if (!current) return

    if (current === window) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    const currentContainer =
      container
        ? (document.querySelector(container) as HTMLElement | null) ?? window
        : window

    scrollContainerRef.current = currentContainer

    if (visibilityMode === "always") {
      return
    }

    startTransition(() => {
      toggleVisibility()
    })

    currentContainer.addEventListener("scroll", toggleVisibility, { passive: true })

    return () => {
      currentContainer.removeEventListener("scroll", toggleVisibility)
    }
  }, [container, toggleVisibility, visibilityMode])

  return (
    <Button
      onClick={scrollToTop}
      className={cn("cursor-pointer", className, {
        flex: isVisible,
        hidden: !isVisible,
      })}
      {...rest}
    >
      {children}
    </Button>
  )
}
