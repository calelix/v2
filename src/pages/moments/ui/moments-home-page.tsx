"use client"

import { Suspense } from "react"

import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
import { Separator } from "@/shared/ui/shadcn/separator"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"
import { ErrorBoundary } from "@/shared/ui/error-boundary/error-boundary"
import { MomentsGallery } from "./moments-gallery"
import { MomentsGallerySkeleton } from "./moments-gallery-skeleton"
import { MomentsGalleryError } from "./moments-gallery-error"

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
      {/* <div className="fixed z-100 top-4 left-1/2 -translate-x-1/2 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-foreground backdrop-blur-sm rounded-full shadow-lg">
        <p className="text-xs font-medium text-background">
          페이지 준비중입니다
        </p>
      </div> */}
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
            <ErrorBoundary fallback={<MomentsGalleryError />}>
              <Suspense fallback={<MomentsGallerySkeleton />}>
                <MomentsGallery />
              </Suspense>
            </ErrorBoundary>
          </FadeUpItem>
        </FadeUpContainer>
      </main>
      <Footer className="h-(--footer-height)" />
    </div>
  )
}
