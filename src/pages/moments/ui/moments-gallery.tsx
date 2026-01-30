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
} from "@/shared/ui/shadcn/carousel"
import { useMomentsInfiniteQuery } from "../model/use-moments-infinite"
import { MomentCard } from "./moment-card"

export const MomentsGallery = () => {
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
                  <Spinner className="size-6" />
                )}
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
      <div className="flex items-center justify-end gap-2 mt-4 text-muted-foreground">
        <span className="text-xs">
          {hasNextPage ? "스크롤하여 더 보기" : "모든 이미지를 불러왔습니다"}
        </span>
        {hasNextPage && <IconArrowRight className="size-4 animate-pulse" />}
      </div>
    </>
  )
}
