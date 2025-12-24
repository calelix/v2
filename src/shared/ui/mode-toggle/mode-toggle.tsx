"use client"

import { useTheme } from "next-themes"

import {
  IconSun,
  IconMoon,
} from "@tabler/icons-react"

import { Button } from "@/shared/ui/shadcn/button"

export const ModeToggle = () => {
  const { theme, systemTheme, setTheme } = useTheme()

  const handleClick = () => {
    const newTheme = (systemTheme === "light" || theme === "light") ? "dark" : "light"

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(newTheme)
      })
    } else {
      setTheme(newTheme)
    }
  }

  return (
    <Button
      size="lg"
      variant="ghost"
      onClick={handleClick}
      className="cursor-pointer"
    >
      <IconSun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <IconMoon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">
        Toggle theme
      </span>
    </Button>
  )
}
