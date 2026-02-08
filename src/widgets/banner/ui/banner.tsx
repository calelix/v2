"use client"

import * as React from "react"

import { IconX } from "@tabler/icons-react"

import { cn } from "@/shared/lib/utils/tailwindcss"
import { Button } from "@/shared/ui/shadcn/button"

type BannerProps = React.ComponentProps<"div">

export const Banner = ({
  children,
  className,
  ...props
}: BannerProps) => {
  const [isOpen, setIsOpen] = React.useState(true)

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cn("relative flex items-center gap-6 overflow-hidden bg-foreground/5 px-6 py-2.5 sm:px-4", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-4">
        {children}
      </div>
      <div className="flex flex-1 justify-end">
        <Button variant="ghost" onClick={handleClose}>
          <IconX />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  )
}
