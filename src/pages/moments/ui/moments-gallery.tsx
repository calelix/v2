"use client"

import * as React from "react"

import { IconArrowRight } from "@tabler/icons-react"
import { useInView } from "react-intersection-observer"
import {
  useWheel,
  useDrag,
} from "@use-gesture/react"

import { Spinner } from "@/shared/ui/shadcn/spinner"
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

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrollContainerRef.current) return

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollLeft - 100,
          behavior: "smooth",
        })
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollLeft + 100,
          behavior: "smooth",
        })
      }
    }, []
  )

  useWheel(
    ({ delta: [dx, dy], event }) => {
      if (!scrollContainerRef.current) return

      event.preventDefault()

      scrollContainerRef.current.scrollLeft += dx + dy
    },
    { target: scrollContainerRef, eventOptions: { passive: false } }
  )

  useDrag(
    ({
      movement: [mx],
      memo = scrollContainerRef.current?.scrollLeft ?? 0,
      event,
    }) => {
      if (!scrollContainerRef.current) return

      if (!(event instanceof PointerEvent)) {
        return
      }

      scrollContainerRef.current.scrollLeft = memo - mx

      return memo
    },
    { target: scrollContainerRef }
  )

  return (
    <>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="overflow-x-auto overflow-y-hidden scrollbar-thin touch-pan-x overscroll-x-contain"
        >
          <div className="flex w-max space-x-4 pb-4">
            {allImages.map((image, index) => (
              <MomentCard key={image.src} image={image} preload={index < 2} />
            ))}
            {hasNextPage && (
              <div ref={sentinelRef} className="flex shrink-0 items-center justify-center w-80 h-60">
                {isFetchingNextPage && (
                  <Spinner className="size-6" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 text-muted-foreground">
        <span className="text-xs">
          {hasNextPage ? "스크롤하여 더 보기" : "모든 이미지를 불러왔습니다"}
        </span>
        {hasNextPage && <IconArrowRight className="size-4 animate-pulse" />}
      </div>
    </>
  )
}
