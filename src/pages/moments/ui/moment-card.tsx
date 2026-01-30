"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/shared/lib/utils/tailwindcss"
import { Spinner } from "@/shared/ui/shadcn/spinner"

interface MomentCardProps {
  image: {
    src: string
    country: string
    city: string
  }
  preload: boolean
}

export const MomentCard = ({
  image,
  preload,
}: MomentCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false)

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  const handleImageError = () => {
    setIsImageLoaded(false)
  }

  return (
    <figure className="shrink-0 select-none pointer-events-none">
      <div className="relative w-80 h-60 overflow-hidden rounded-md">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/25 z-10">
            <Spinner className="size-4" />
          </div>
        )}
        <Image
          src={image.src}
          alt={`${image.city}, ${image.country}`}
          fill
          sizes="320px"
          loading={preload ? "eager" : "lazy"}
          preload={preload}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn("object-cover grayscale dark:opacity-75 hover:grayscale-25 transition duration-300", {
            "opacity-100": isImageLoaded,
            "opacity-0": !isImageLoaded,
          })}
        />
      </div>
      <figcaption className="text-muted-foreground pt-2 text-xs">
        Shot in{" "}
        <span className="text-accent font-semibold capitalize">
          {image.city}, {image.country}
        </span>
      </figcaption>
    </figure>
  )
}
