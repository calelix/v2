"use client"

import * as React from "react"
import Image from "next/image"

import { IconArrowRight } from "@tabler/icons-react"

import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"
import {
  ScrollArea,
  ScrollBar,
} from "@/shared/ui/shadcn/scroll-area"
import { Separator } from "@/shared/ui/shadcn/separator"

const images = [
  { src: "/images/moments/example/01.jpg", alt: "Image 1", place: "Osaka, Japan" },
  { src: "/images/moments/example/02.jpg", alt: "Image 2", place: "Osaka, Japan" },
  { src: "/images/moments/example/03.jpg", alt: "Image 3", place: "Gunma, Japan" },
  { src: "/images/moments/example/04.jpg", alt: "Image 4", place: "Tokyo, Japan" },
  { src: "/images/moments/example/05.jpg", alt: "Image 5", place: "Osaka, Japan" },
]

export const MomentsHomePage = () => {
  return (
    <div
      style={
        {
          "--header-height": "calc(var(--spacing)*32)",
          "--footer-height": "calc(var(--spacing)*32)",
        } as React.CSSProperties
      }
    >
      <div className="fixed z-100 top-4 left-1/2 -translate-x-1/2 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-foreground backdrop-blur-sm rounded-full shadow-lg">
        <p className="text-xs font-medium text-background">
          페이지 준비중입니다
        </p>
      </div>
      <Header className="sticky top-0 z-50 h-(--header-height) bg-background" />
      <main className="relative flex container py-8 gap-8 min-h-[calc(100svh-var(--header-height)-var(--footer-height))]">
        <FadeUpContainer className="flex flex-col w-full max-w-4xl shrink-0">
          <FadeUpItem>
            <h1 className="text-lg font-bold">
              Moments
            </h1>
          </FadeUpItem>
          <FadeUpItem className="mt-2">
            <p className="text-xs/relaxed text-muted-foreground">
              쉽게 보내기 싫은 지나간 순간들을 사진으로 남깁니다.
            </p>
            <p className="text-xs/relaxed text-muted-foreground">
              하루의 빛과 스치는 풍경, 사소한 감정들을 모아 흐릿해지기 전의 기억을 조용히 붙잡아 두었습니다.
            </p>
          </FadeUpItem>
          <FadeUpItem>
            <Separator className="my-8 lg:my-12" />
          </FadeUpItem>
          <FadeUpItem>
            <div className="flex flex-col gap-8">
              <FadeUpItem>
                <ScrollArea className="w-full rounded-md whitespace-nowrap">
                  <div className="flex w-max space-x-4 pb-4">
                    {images.map((image) => (
                      <figure key={image.src} className="shrink-0">
                        <div className="relative w-80 h-60 overflow-hidden rounded-md">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            className="object-cover grayscale dark:opacity-75 hover:grayscale-25 transition duration-300"
                            fill
                            sizes="320px"
                          />
                        </div>
                        <figcaption className="text-muted-foreground pt-2 text-xs">
                          Shot in{" "}
                          <span className="text-accent font-semibold">
                            {image.place}
                          </span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="flex items-center justify-end gap-2 mt-4 text-muted-foreground">
                  <span className="text-xs">
                    스크롤하여 더 보기
                  </span>
                  <IconArrowRight className="size-4 animate-pulse" />
                </div>
              </FadeUpItem>
            </div>
          </FadeUpItem>
        </FadeUpContainer>
      </main>
      <Footer className="h-(--footer-height)" />
    </div>
  )
}
