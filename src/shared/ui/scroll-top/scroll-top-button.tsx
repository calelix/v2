"use client"

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react"

import { cn } from "@/shared/lib/utils/tailwindcss"
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
  const [isVisible, setIsVisible] = useState(() => getInitialVisibility(visibilityMode, container))

  const scrollContainerRef = useRef<HTMLElement | Window | null>(null)

  const toggleVisibility = useCallback(() => {
    if (visibilityMode === "always") {
      setIsVisible(true)
      return
    }

    const current = scrollContainerRef.current
    if (!current) return

    const scrollTop = current === window
      ? window.scrollY
      : (current as HTMLElement).scrollTop

    setIsVisible(scrollTop > SHOW_AFTER_SCROLL_POSITION)
  }, [visibilityMode])

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
    if (visibilityMode === "always") {
      return
    }

    const currentContainer =
      container
        ? (document.querySelector(container) as HTMLElement | null) ?? window
        : window

    scrollContainerRef.current = currentContainer

    currentContainer.addEventListener("scroll", toggleVisibility)

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

const getInitialVisibility = (visibilityMode: VisibilityMode, container?: string) => {
  if (visibilityMode === "always") {
    return true
  }

  if (typeof window === "undefined") {
    return false
  }

  let scrollTop = 0

  if (container) {
    const element = document.querySelector(container) as HTMLElement | null
    scrollTop = element?.scrollTop ?? window.scrollY
  } else {
    scrollTop = window.scrollY
  }

  return scrollTop > SHOW_AFTER_SCROLL_POSITION
}
