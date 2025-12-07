"use client"

import { useTheme } from "next-themes"

import {
  MoonIcon,
  SunIcon,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"

export function ModeToggle() {
  const { theme, systemTheme, setTheme } = useTheme()

  const handleClick = () => {
    const isLightTheme = systemTheme === "light" || theme === "light"
    const isDarkTheme = systemTheme === "dark" || theme === "dark"

    if (isLightTheme) {
      setTheme("dark")
    } else if (isDarkTheme) {
      setTheme("light")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="cursor-pointer border-none bg-inherit text-foreground shadow-none focus:outline-none focus-visible:ring-0"
    >
      <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">
        Toggle theme
      </span>
    </Button>
  )
}
