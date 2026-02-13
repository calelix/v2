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
      className={cn("relative flex gap-8 bg-foreground/5 px-4 lg:px-8 py-2.5", className)}
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
