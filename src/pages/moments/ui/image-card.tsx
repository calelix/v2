"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/shared/lib/utils/tailwindcss"
import { Spinner } from "@/shared/ui/shadcn/spinner"

interface ImageCardProps {
  src: string
  alt: string
  place: string
}

export const ImageCard = ({
  src,
  alt,
  place,
}: ImageCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false)

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  const handleImageError = () => {
    setIsImageLoaded(false)
  }

  return (
    <figure className="shrink-0">
      <div className="relative w-80 h-60 overflow-hidden rounded-md">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/25 z-10">
            <Spinner className="size-4" />
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="320px"
          loading="lazy"
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
        <span className="text-accent font-semibold">
          {place}
        </span>
      </figcaption>
    </figure>
  )
}
