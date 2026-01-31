"use client"

import * as React from "react"

import { IconArrowRight } from "@tabler/icons-react"
import { useInView } from "react-intersection-observer"
import WheelGesturesPlugin from "embla-carousel-wheel-gestures"

import { Spinner } from "@/shared/ui/shadcn/spinner"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/shared/ui/shadcn/carousel"
import { useMomentsInfiniteQuery } from "../model/use-moments-infinite"
import { MomentCard } from "./moment-card"

export const MomentsGallery = () => {
  const previousPageCountRef = React.useRef(0)
  const [announcement, setAnnouncement] = React.useState("")

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMomentsInfiniteQuery()

  const fetchNext = React.useEffectEvent(
    (visible: boolean) => {
      if (!visible) {
        return
      }

      if (hasNextPage && !isFetchingNextPage) {
        setAnnouncement("새 이미지를 불러오는 중입니다")
        fetchNextPage()
      }
    }
  )

  const { ref: sentinelRef } = useInView({
    threshold: 0.5,
    onChange: fetchNext,
  })

  const allImages = React.useMemo(
    () => data.pages.flatMap((page) => page.images),
    [data]
  )

  React.useEffect(() => {
    if (previousPageCountRef.current < 0) {
      return
    }

    if (isFetchingNextPage) {
      return
    }

    const currentImageCount = allImages.length
    const isImageAdded = currentImageCount > previousPageCountRef.current

    if (isImageAdded) {
      const addedImageCount = currentImageCount - previousPageCountRef.current

      if (hasNextPage) {
        setAnnouncement(`${addedImageCount}개의 이미지가 추가되었습니다`)
      } else {
        setAnnouncement(`${addedImageCount}개의 이미지가 추가되었습니다. 모든 이미지를 불러왔습니다`)
      }
    }

    previousPageCountRef.current = currentImageCount
  }, [allImages.length, hasNextPage, isFetchingNextPage])

  return (
    <>
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
          containScroll: "trimSnaps",
        }}
        plugins={[WheelGesturesPlugin()]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {allImages.map((image, index) => (
            <CarouselItem key={image.src} className="pl-4 basis-auto">
              <MomentCard image={image} preload={index < 2} />
            </CarouselItem>
          ))}
          {hasNextPage && (
            <CarouselItem className="pl-4 basis-auto">
              <div ref={sentinelRef} className="flex shrink-0 items-center justify-center w-80 h-60">
                {isFetchingNextPage && (
                  <Spinner className="size-6" aria-label="새 이미지를 불러오는 중입니다" />
                )}
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <CarouselPrevious className="relative top-0 left-0 translate-none" />
            <CarouselNext className="relative top-0 right-0 translate-none" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {hasNextPage ? "스크롤하여 더 보기" : "모든 이미지를 불러왔습니다"}
            </span>
            {hasNextPage && <IconArrowRight className="size-4 animate-pulse" aria-hidden="true" />}
          </div>
        </div>
      </Carousel>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </>
  )
}
