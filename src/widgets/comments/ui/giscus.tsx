"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

import { cn } from "@/shared/lib/utils/tailwindcss"

const COMMENTS_ID = "comments"

const getCurrentTheme = (theme?: string, systemTheme?: string) => {
  if (theme === "dark") {
    return "noborder_gray"
  }

  if (theme === "light") {
    return "light"
  }

  if (systemTheme === "dark") {
    return "noborder_gray"
  }

  return "light"
}

/**
 * @see https://giscus.app/ko
 */
export const Giscus = () => {
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    const script = document.createElement("script")

    const attributes = {
      "src": "https://giscus.app/client.js",
      "data-repo": "calelix/v2",
      "data-repo-id": "R_kgDOQrlesg",
      "data-category": "General",
      "data-category-id": "DIC_kwDOQrless4C0MqV",
      "data-mapping": "pathname",
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "bottom",
      "data-theme": getCurrentTheme(theme, systemTheme),
      "data-lang": "ko",
      "crossorigin": "anonymous"
    }

    Object.entries(attributes).forEach(
      ([key, value]) => script.setAttribute(key, value)
    )

    script.async = true

    const comments = document.getElementById(COMMENTS_ID)

    if (comments) {
      comments.appendChild(script)
    }

    return () => {
      if (comments) {
        comments.removeChild(script)
      }
    }
  }, [theme, systemTheme])

  return (
    <section className={cn("flex items-center justify-center w-full min-h-114 my-8 lg:my-12")}>
      <div id={COMMENTS_ID} className="size-full" />
    </section>
  )
}
